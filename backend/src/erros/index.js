const CustomAPIError = require('./custom-error')
const BadRequestError = require('./bad-request')
const UnauthenticadError = require('./unauthenticated')
const NotFoundError = require('./no-resource-found')

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticadError,
  NotFoundError
}