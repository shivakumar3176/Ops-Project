const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");
const upload = require("../Middlewares/upload"); 
const { 
  getUserProfile, 
  updateUserProfile, 
  updateUserAvatar 
} = require("../Controllers/user.controller");

router.get("/me", auth, getUserProfile);
router.put("/me", auth, updateUserProfile);

router.put("/me/avatar", auth, upload.single('avatar'), updateUserAvatar);

module.exports = router;