import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import { NotFoundError, 
  UnauthenticatedError } from '../errors/index.js'

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

export default protectRoute