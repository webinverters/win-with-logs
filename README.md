## Synopsis

At the top of the file there should be a short introduction and/ or overview that explains **what** the project is. This description should match descriptions added for package managers (Gemspec, package.json, etc.)

## Code Example

Show what the library does as concisely as possible, developers should be able to figure out **how** your project solves their problem by looking at the code example. Make sure the API you are showing off is obvious, and that your code is short and concise.

## Motivation

A short description of the motivation behind the creation and maintenance of the project. This should explain **why** the project exists.

## Installation

Provide code examples and explanations of how to get the project.

## API Reference

logger.log('$EventLabel') // broadcasts an event and records tracked event.
logger.log('@EventLabel', details); // records a tracked event
logger.log('Something happened.', details)   // regular log.
logger.map('@EventLabel', { key: 'index1' });  // instead of making the user do this, attempt to do it automatically using fuzzy logic and then let them correct issues in their control panel.

// see if you can generate a new IAM user for each customer (and use the access keys in your API) and
// to funnel incoming data into the right account for display purposes.

## Tests

npm install -g kinesalite

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)