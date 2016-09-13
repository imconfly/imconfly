'use strict';

/**
 * Common exception class for Imconfly application.
 * All parts of Imconfly code must throw only this type of errors.
 *
 */
class ImconflyError extends Error {
  constructor(message) {
    super(message);
  }
}

exports.ImconflyError = ImconflyError;
