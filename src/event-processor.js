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
    saveEventsToLongTermStorage: true,
    logTableName: 'log',
    errorTableName: 'error-log',
    goalTableName: 'failed-goals'
  });

  m.processEvent = function(eventPayload, eventType) {
    var eventRow, logTableName = config.logTableName;  // by default logs to logTableName

    return p.resolve().then(function() {
      return extractEventRow(eventPayload,eventType);
    })
    .then(function(eventrow) {
      eventRow = eventrow;

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
      if (eventRow.level == 50 && config.errorTableName) {
        logTableName = config.errorTableName;

        if (eventRow.uid) {
          return trackGoal(eventRow);
        }
      }
      return eventRow;
    })
    .then(function(eventRow) {
      return storage.save(logTableName, eventRow)
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
      if (!eventPayload.details) {
        eventPayload.details = extractDetailsObject(eventPayload).details;
      }

      var eventRow = {
        details: (eventPayload.details && JSON.stringify(eventPayload.details)) || 'N/A',
        local_ts: Math.floor(Date.parse(eventPayload.time)/1000),
        component: eventPayload.name || 'unknown',
        host: eventPayload.hostname || 'unknown',
        label: eventPayload.eventLabel || 'unknown',
        env: eventPayload.env || 'env',
        pid: eventPayload.pid || 'unknown',
        app: (eventPayload.app || 'app') + '-' + (eventPayload.env || 'env'),
        version: eventType || 'unknown',
        level: eventPayload.level || 'unspecified'
      };

      if (eventPayload.completeGoal) {
        eventRow.completeGoal = eventPayload.completeGoal;
      }
      if (eventPayload.uid) {
        eventRow.uid = eventPayload.uid; // goal unique identifier
      }

      eventRow.key = util.format('%s-%s', eventRow.app, eventRow.label);
      eventRow.timestamp = new Date().getTime();

      return eventRow;
    }
  }

  function completeGoal(uid) {
    return storage.delete(config.goalTableName, {uid: uid});
  }

  function trackGoal(goal) {
    goal.callCount = 0;

    if (!goal.uid) return p.resolve('No goal uid specified.');
    goal.name = goal.uid.split('#')[0];

    var currentGoal = currentGoal || goal;
    currentGoal.lastModified = new Date().getTime();
    goal.status = 'TemporaryFailure';
    goal.callCount += 1;

    return storage.save(config.goalTableName, goal)
      .then(function() {
        return goal;
      })
      .catch(function(err) {
        console.error('Error saving the goal:');
        throw err;
      });
  }

  function fixJSON(str) {
    var json = str.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
    json = json.replace(/\'/g, '"');
    return json;
  }

  // the ugly reality is that bunyan wants you to always log objects, whereas win-with-logs API wants you to
  // generally always log a string followed by an object (2 params total).  This function is meant to analyze
  // the payload and split it back into the original 2 params.
  function extractDetailsObject(eventPayload) {
    var msg = eventPayload.msg;

    var detailsObjectStart = msg.indexOf('{');
    var parse = false;
    if (detailsObjectStart>=0) {
      parse = true;
    }
    else {
      detailsObjectStart = msg.indexOf('[');
      if (detailsObjectStart >= 0) parse = true;
    }

    if (parse) {
      var json = msg.substr(detailsObjectStart);
      try {
        return { details: JSON.parse(json) };
      } catch (ex) {
        json = fixJSON(json);
        try {
          return JSON.parse(json);
        }
        catch (ex) {
          console.log('WARNING: details could not be parsed.', json, ex);
          return { details: msg.substr(detailsObjectStart) };
        }
      }
    }

    if (eventPayload.eventLabel && eventPayload.eventLabel.length) {
      return { details: msg.substr(eventPayload.eventLabel.length+1) };
    } else {
      return { details: msg };
    }
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
