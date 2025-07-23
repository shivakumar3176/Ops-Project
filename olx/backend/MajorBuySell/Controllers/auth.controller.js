const User = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../Utils/sendEmail");
const crypto = require("crypto");

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "2h" });
};

// ===================== SIGNUP =====================
const signup = async (req, res) => {
  try {
    const { name, email, phoneNo, password } = req.body;

    let user = await User.findOne({ email });
    // If user exists but is not verified, delete them to allow re-signup
    if (user && !user.isEmailVerified) {
      await User.findByIdAndDelete(user._id);
    } else if (user && user.isEmailVerified) {
      return res.status(400).json({ message: "User with this email already exists and is verified." });
    }

    user = new User({ name, email, phoneNo, password });

    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    const verificationUrl = `https://ops-frontend-wrbp.onrender.com/verify-email/${verificationToken}`;
    const message = `
      <h1>Welcome to OPS!</h1>
      <p>Thank you for registering. Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" target="_blank">Verify Your Email</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'OPS - Email Verification',
      html: message,
    });

    res.status(201).json({
      message: "Signup successful. Please check your email to verify your account.",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===================== LOGIN =====================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateAccessToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===================== VERIFY EMAIL =====================
const verifyEmail = async (req, res) => {
  try {
    const verificationToken = crypto
      .createHash('sha266')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired." });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    const token = generateAccessToken(user._id);
    res.status(200).json({
      message: "Email successfully verified.",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===================== RESEND VERIFICATION EMAIL =====================
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "This account is already verified." });
    }

    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    const verificationUrl = `https://ops-frontend-wrbp.onrender.com/verify-email/${verificationToken}`;
    const message = `
      <h1>Resent: Verify Your Email for OPS</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" target="_blank">Verify Your Email</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'OPS - Resend Email Verification',
      html: message,
    });

    res.status(200).json({ message: "Verification email sent. Please check your inbox." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  signup,
  login,
  verifyEmail,
  resendVerificationEmail,
};