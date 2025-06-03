class MissingSubfieldsError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.name = "MissingSubfieldsError"
  }
}

class InvalidSubjectDataError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.name = "InvalidSubjectDataError"
  }
}

class NoPreferredTermError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.name = "NoPreferredTermError"
  }
}

module.exports = { MissingSubfieldsError, InvalidSubjectDataError, NoPreferredTermError }