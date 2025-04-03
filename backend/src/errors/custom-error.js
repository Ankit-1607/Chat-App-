class CustomAPIError extends Error {
  constructor(message, _statusCode) {
    super(message)
  }
}

export default CustomAPIError