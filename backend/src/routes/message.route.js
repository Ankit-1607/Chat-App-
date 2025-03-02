const express = require('express')
const protectRoute = require('../middlewares/protect-route.middleware')
const router = express.Router()

const {
  getUsersForSidebar,
  getMessages,
  sendMessage
} = require('../controllers/message.controller')

router.get('/users', protectRoute, getUsersForSidebar)
router.get('/:id', protectRoute, getMessages)

router.post('/send/:id', protectRoute, sendMessage)

module.exports = router