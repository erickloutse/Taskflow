import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get all users
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create user
router.post("/", verifyToken, async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const user = new User(req.body);
    await user.save();

    // Don't return the password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updates = { ...req.body };

    // If password is being updated, it will be hashed by the pre-save hook
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    Object.keys(updates).forEach((update) => {
      user[update] = updates[update];
    });

    await user.save();

    // Don't return the password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
