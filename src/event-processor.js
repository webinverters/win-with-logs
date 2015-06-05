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
    saveEventsToLongTermStorage: true
  });

  m.processEvent = function(eventPayload, eventType) {
    var eventRow;
    return p.resolve().then(function() {
      return extractEventRow(eventPayload,eventType);
    })
    .then(function(eventrow) {
      eventRow = eventrow;
      console.log('EVENTROW', eventrow);
      return saveToLongTermStorage(eventRow, eventPayload);
    })
    .then(function(longTermStorageUrl) {
        // the database only allows 100 characters.
      if (eventRow.details.length && eventRow.details.length > 100) {
        eventRow.details = eventRow.details.substr(0, 99);
      }
      if(eventRow.label.length > 24) {
        eventRow.label = eventRow.label.substr(0,24);
      }
      eventRow.url = longTermStorageUrl;
      eventRow.timestamp = Math.floor(new Date().getTime()/1000);
      return storage.save('eventlog', eventRow)
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
      var details = extractDetailsObject(eventPayload);

      var eventRow = {
        details: details,
        local_ts: Math.floor(Date.parse(eventPayload.time)/1000),
        component: eventPayload.name,
        host: eventPayload.host,
        label: eventPayload.eventLabel,
        env: eventPayload.env,
        pid: eventPayload.pid,
        app: eventPayload.app || 'Unknown App',
        version: eventType,
        level: eventPayload.level
      };

      return eventRow;
    }
  }

  function extractDetailsObject(eventPayload) {
    var msg = eventPayload.msg;
    console.log('MESSAGE=', msg);
    var detailsObjectStart = msg.indexOf('{');
    if (detailsObjectStart>=0) {
      return JSON.parse(msg.substr(detailsObjectStart));
    }
    detailsObjectStart = msg.indexOf('[');
    if (detailsObjectStart >= 0) {
      return JSON.parse(msg.substr(detailsObjectStart));
    }
    return { details: msg.substr(eventPayload.eventLabel.length+1) };
  }

  /**
   * Container names are per application per environment.
   * @note: In S3 a container name would reference a bucket.
   */
  function chooseStorageContainerName(eventRow) {
    if (!eventRow.app) throw 'chooseStorageContainerName eventRow.app is empty';
    if (!eventRow.env) warn('chooseStorageContainerName eventRow.env is empty');
    return eventRow.app + '-' +eventRow.env;
  }

  /**
   * Constructs an S3 friendly URL (uses random hash at start of key name to optimize S3 performance)
   * @param eventRow
   */
  function chooseStorageKey(eventRow) {
    return util.format("%s--%s-%s-%s", new Date().getUTCMilliseconds(), new Date().toISOString(), eventRow.component, eventRow.version);
  }

  function saveToLongTermStorage(eventRow, eventPayload) {
    var container = chooseStorageContainerName(eventRow);
    var key = chooseStorageKey(eventRow);

    return longTermStorage.save(container, key, eventPayload);
  }

  return m;
};
