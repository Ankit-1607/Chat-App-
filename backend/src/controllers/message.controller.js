const User = require('../models/user.model')
const Message = require('../models/message.model')

const getUsersForSidebar = async (req, res) => {
  
  const loggedInUserId = req.existingUser._id
  const filteredUsers = await User.find( {
    _id: { $ne: loggedInUserId }
  }).select('-password')
  
  res.status(200).json(filteredUsers)
}

const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params
  const myId = req.existingUser._id

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId }
    ]
  })

  res.status(200).json(messages)
}

const sendMessage = async (req, res) => {
  const { text, image } = req.body
  const { id: receiverId } = req.params
  const senderId = req.existingUser._id

  let imageURL;

  if(image) {
    // if user wants to send image, upload it to cloudinary
    const uploadResponse = cloudinary.uploader.upload(image);
    imageURL = uploadResponse.secure_url;
  }

  const newMessage = new Message( {
    senderId,
    receiverId,
    text,
    image: imageURL
  })

  await newMessage.save()  

  // real time functionality using socket.io

  res.status(201).json(newMessage)
}

module.exports = {
  getUsersForSidebar,
  getMessages,
  sendMessage
}