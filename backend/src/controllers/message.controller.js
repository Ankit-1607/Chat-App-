import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';

export const getUsersForSidebar = async (req, res) => {
  
  const loggedInUserId = req.existingUser._id
  const filteredUsers = await User.find( {
    _id: { $ne: loggedInUserId }
  }).select('-password')
  
  res.status(200).json(filteredUsers)
}

export const getMessages = async (req, res) => {
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

export const sendMessage = async (req, res) => {
  const { text, image } = req.body
  const { id: receiverId } = req.params
  const senderId = req.existingUser._id

  let imageURL;

  if(image) {
    // if user wants to send image, upload it to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
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
  const receiverSocketId = getReceiverSocketId(receiverId);
  // when new message is sent if the receiver is online send them the message in realtime, i.e., without any page refresh
  if(receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage);// broadcast to a specified user
  }


  res.status(201).json(newMessage)
}