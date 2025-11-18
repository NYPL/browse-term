class MissingSubfieldsError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.name = "MissingSubfieldsError"
  }
}

class InvalidAuthorityDataError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.name = "InvalidAuthorityDataError"
  }
}

class NoPreferredTermError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.name = "NoPreferredTermError"
  }
}

module.exports = { MissingSubfieldsError, InvalidAuthorityDataError, NoPreferredTermError }