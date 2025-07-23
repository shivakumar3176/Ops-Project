const express = require("express");
const router = express.Router();
const { signup, login, verifyEmail, resendVerificationEmail } = require("../Controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify/:token", verifyEmail); // New route for the email link
router.post("/resend-verification", resendVerificationEmail);

module.exports = router;