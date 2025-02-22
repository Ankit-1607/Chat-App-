const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const { 
        UnauthenticatedError, 
        NotFoundError 
      } = require('../erros/index')


const protectRoute = async (req, res, next) => {
  const token = req.cookies.token

  if(!token) {
    throw new UnauthenticatedError('Unauthorized - No token detected')
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  if(!decoded) {
    throw new UnauthenticatedError('Unauthorized - Invalid token detected')
  }

  const existingUser = await User.findById(decoded.userId).select('-password') // select everything but password

  if(!existingUser) {
    throw new NotFoundError('User not found')
  }

  req.existingUser = existingUser
  next() // control goes to updateProfile or checkAuth
}

module.exports = protectRoute