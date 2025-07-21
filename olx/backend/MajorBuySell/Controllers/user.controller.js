const User = require("../Models/user.model");
const uploadOnCloudinary = require("../Utils/uploadOnCloudinary");

const getUserProfile = async (req, res) => {
  try {
    // We now populate the 'reviews' field and the nested 'reviewer' field
    const user = await User.findById(req.userId)
      .select("-password -refreshToken")
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviewer',
          select: 'name profilePic' // Only get the reviewer's name and picture
        }
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, phoneNo } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.phoneNo = phoneNo !== undefined ? phoneNo : user.phoneNo;

    const updatedUser = await user.save();
    
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNo: updatedUser.phoneNo,
      profilePic: updatedUser.profilePic,
      averageRating: updatedUser.averageRating,
      reviews: updatedUser.reviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult) {
      return res.status(500).json({ message: "Avatar upload failed" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profilePic: uploadResult.secure_url },
      { new: true }
    ).select("-password -refreshToken");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, updateUserAvatar };