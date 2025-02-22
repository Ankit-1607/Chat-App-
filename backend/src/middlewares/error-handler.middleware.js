const { CustomAPIError } = require('../erros')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  // better way??
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ msg: messages[0] }); // will show error 1 by 1
  }

  if(err instanceof CustomAPIError) {
    console.log(err)
    return res.status(err.statusCode).json({msg: err.message})
  }

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send('Something went wrong, pls try again later')
}

module.exports = errorHandlerMiddleware