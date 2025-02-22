class CustomAPIError extends Error {
  constructor(message, _statusCode) {
    super(message)
  }
}

module.exports = CustomAPIError