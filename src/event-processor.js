/**
 * @module myModule
 * @summary: This module's purpose is to:
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-06-01.
 * @license Apache-2.0
 */

"use strict";

var util = require('util');
var getConfig = require('../config');

/**
 *
 * @param config
 * @param storage .save(): promise rejects if it should not be retried.
 * @param longTermStorage - .save(): resolves url to saved resource.  Rejects if it should not be retried.
 * @returns {{}}
 */
module.exports = function construct(config, storage, longTermStorage) {
  var m = {};
  config = config ? config : {};
  config = _.defaults(config, {
    saveEventsToLongTermStorage: true
  });

  m.processEvent = function(eventPayload, eventType) {
    var eventRow, _logTableName;

    return p.resolve().then(function() {
      return extractEventRow(eventPayload,eventType);
    })
    .then(function(eventrow) {
      _.extend(config,getConfig(eventrow.env, 'wwl'))
      _logTableName = config.TABLE_EVENTS  // by default logs to the event table.
      eventRow = eventrow
      // dynamo's max item size is 400kb, but we'll cap it at 4000 bytes to be safe.
      if (JSON.stringify(eventRow).length > 4000) {
        return saveToLongTermStorage(eventRow, eventPayload);
      }
      return eventRow;
    })
    .then(function(eventRow) {
      if (eventRow.completeGoal) {
        return completeGoal(eventRow.completeGoal);
      }
      return eventRow;
    })
    .then(function(eventRow) {
      if (eventRow.level == 50 && config.TABLE_ERRORS) {
        _logTableName = config.TABLE_ERRORS;

        if (eventRow.uid) {
          return trackGoal(eventRow);
        }
      }
      return eventRow;
    })
    .then(function(eventRow) {
      return storage.save(_logTableName, eventRow)
        .catch(function(err) {
          console.error('Error saving tracked event to storage.');
          console.error(err);
        });
    })
    .catch(function(err) {
      console.error('Unexpected error processing tracked event.');
      console.error(err);
    });
  };

  function extractEventRow(eventPayload, eventType) {
    eventType = eventType || 'bunyan-v1';
    // you have to extract the payload and the essential details about the logged event.
    if (eventType=='bunyan-v1') {
      var eventRow = {
        details: eventPayload.details,
        local_ts: Math.floor(Date.parse(eventPayload.time)/1000),
        component: eventPayload.name || 'unknown',
        host: eventPayload.hostname || 'unknown',
        label: eventPayload.eventLabel || 'unknown',
        env: eventPayload.env || 'env',
        pid: eventPayload.pid || 'unknown',
        app: (eventPayload.app || 'app') + '-' + (eventPayload.env || 'env'),
        version: eventType || 'unknown',
        level: eventPayload.level || 'unspecified'
      }

      if (eventPayload.completeGoal) {
        eventRow.completeGoal = eventPayload.completeGoal;
      }
      if (eventPayload.uid) {
        eventRow.uid = eventPayload.uid; // goal unique identifier
      }

      eventRow.key = util.format('%s-%s', eventRow.app, eventRow.label);
      eventRow.timestamp = new Date().getTime()
      eventRow.isotime = new Date().toISOString()

      return eventRow;
    }
  }

  function completeGoal(uid) {
    var name = uid.split('#')[0];
    return storage.delete(config.TABLE_FAILED_GOALS, {name: name, uid: uid});
  }

  function trackGoal(goal) {
    goal.callCount = 0;

    if (!goal.uid) return p.resolve('No goal uid specified.');
    goal.name = goal.uid.split('#')[0];

    var currentGoal = currentGoal || goal;
    currentGoal.lastModified = new Date().getTime();
    goal.status = 'TemporaryFailure';
    goal.callCount += 1;

    return storage.save(config.TABLE_FAILED_GOALS, goal)
      .then(function() {
        return goal;
      })
      .catch(function(err) {
        console.error('Error saving the goal:');
        throw err;
      });
  }

  /**
   * Container names are per application per environment.
   * @note: In S3 a container name would reference a bucket.
   */
  function chooseStorageContainerName(eventRow) {
    if (!eventRow.app) throw 'chooseStorageContainerName eventRow.app is empty';
    if (!eventRow.env) warn('chooseStorageContainerName eventRow.env is empty');
    return eventRow.app;
  }

  /**
   * Constructs an S3 friendly URL (uses random hash at start of key name to optimize S3 performance)
   * @param eventRow
   */
  function chooseStorageKey(eventRow) {
    return util.format("%s-%s.%s", new Date().toISOString(), eventRow.component, eventRow.version);
  }

  function saveToLongTermStorage(eventRow, eventPayload) {
    var container = chooseStorageContainerName(eventRow);
    var key = chooseStorageKey(eventRow);

    return longTermStorage.save(container, key, eventPayload)
      .then(function(result) {
        console.log('Saved to url: ', result);
        eventRow.url = result;
        return eventRow;
      })
      .catch(function(err) {
        console.error('Failed to save to S3.', err);
        throw err;
      });
  }

  return m;
};
