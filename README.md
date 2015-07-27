## Synopsis

At the top of the file there should be a short introduction and/ or overview that explains **what** the project is. This description should match descriptions added for package managers (Gemspec, package.json, etc.)

## Code Example

var logger = require('win-with-logs')({
  name: 'webservice',
  env: 'dev',
  app: 'test-app'
  enableTrackedEvents: true  // default is true
});

// log a tracked event (that you can query by, and view centrally)
logger.log('@USAGE_LEVEL', {superdate: 'sumptuous', valueInt: 10, valueStr: 'whatever'});

// log a local event (untracked):
logger.log('Something happened...', {superdate: 'sumptuous', valueInt: 10, valueStr: 'whatever'});

// log a tracked error event:
logger.error('@MESSAGE_CORRUPTED', {messageId: 'topgun'});

## Motivation

A short description of the motivation behind the creation and maintenance of the project. This should explain **why** the project exists.

## Installation

Provide code examples and explanations of how to get the project.

## API Reference

logger.log('$EventLabel') // broadcasts an event and records tracked event.
logger.log('@EventLabel', details); // records a tracked event
logger.log('Something happened.', details)   // regular log.

// NOT YET IMPLEMENTED: set up mappings for reports
logger.map('@EventLabel', { valueInt: 'usage kwh' });  // instead of making the user do this, attempt to do it automatically using fuzzy logic and then let them correct issues in their control panel.

// see if you can generate a new IAM user for each customer (and use the access keys in your API) and
// to funnel incoming data into the right account for display purposes.


### Goals:

- The goal uid must be specifed like {GOAL_NAME}#{uid}  Example: sayhello#100.  Note they are seperated by a pound sign.

## Tests

npm install -g kinesalite

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)