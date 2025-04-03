import User from '../models/user.model.js';
import { BadRequestError } from '../errors/index.js';
import bcrypt from 'bcryptjs';
import generateToken from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body

  const existingUser = await User.findOne({ email });
  
  if(existingUser) 
    throw new BadRequestError('Email already exists')

  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = new User({
    fullName,
    email,
    password: hashedPassword
  })
  
  if(newUser) {
    // generate jwt token
    generateToken(newUser._id, res)
    await newUser.save()

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    })

    console.log('New user created')
  } else {
    throw new BadRequestError('Invalid user data')
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  const existingUser = await User.findOne({ email })

  if(!existingUser) {
    throw new BadRequestError('Invalid Credentials')
  }

  const isPassowordCorrect = await bcrypt.compare(password, existingUser.password)

  if(!isPassowordCorrect) 
    throw new BadRequestError('Invalid Credentials')

  generateToken(existingUser._id, res)

  res.status(200).json({
    _id: existingUser._id,
    fullName: existingUser.fullName,
    email: existingUser.email,
    profilePic: existingUser.profilePic
  })
}

export const logout = (req, res) => {
  res.cookie('token', '', {
    maxAge: 0
  })

  res.status(200).json({
    msg: "Logged out successfully"
  })
}

export const updateProfile = async (req, res) => {
  const { profilePic } = req.body
  const existingUser = req.existingUser._id

  if(!profilePic) {
    throw new BadRequestError('Profile pic is required!')
  }

  const uploadResponse = await cloudinary.uploader.upload(profilePic) // cloudinary is a bucket for images

  const updatedUser = await User.findByIdAndUpdate(existingUser, { profilePic: uploadResponse.secure_url }, { new: true })

  res.status(200).json(updatedUser)
}

export const checkAuth = (req, res) => {
  res.status(200).json(req.existingUser)
}