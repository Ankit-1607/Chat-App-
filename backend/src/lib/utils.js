const jwt = require('jsonwebtoken')

const generateToken = (userId, res) => {

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn:'12d' })

  res.cookie('token', token, {
    maxAge: 12 * 24 * 60 * 60 * 1000, // in milliseconds
    httpOnly: true, // prevent XSS(cross - site scripting) attacks
    sameSite: 'strict', // prevent CSRF( cross-site request forgery ) attacks
    secure: process.env.NODE_ENV !== 'developement' // https or http
  })

  return token
}

module.exports = generateToken