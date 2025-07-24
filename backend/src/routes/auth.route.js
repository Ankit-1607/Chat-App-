import express from "express";

import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth
} from "../controllers/auth.controller.js";
import protectRoute from "../middlewares/protect-route.middleware.js";
const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

// protect route protects the route from un-authorized access - only for registered users
router.put('/update-profile', protectRoute, updateProfile);

router.get('/check', protectRoute, checkAuth);

export default router