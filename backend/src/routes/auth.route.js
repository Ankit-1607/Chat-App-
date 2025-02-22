const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth
} = require("../controllers/auth.controller");
const protectRoute = require('../middlewares/protect-route.middleware');


router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

// protect route protects the route from un-authorized access - only for registered users
router.put('/update-profile', protectRoute, updateProfile);

router.get('/check', protectRoute, checkAuth);

module.exports = router