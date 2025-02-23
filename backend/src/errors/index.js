const CustomAPIError = require('./custom-error')
const BadRequestError = require('./bad-request')
const UnauthenticatedError = require('./unauthenticated')
const NotFoundError = require('./no-resource-found')

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  NotFoundError
}