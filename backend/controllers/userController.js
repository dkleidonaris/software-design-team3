const User = require('../models/user');
const { checkMissingFields } = require('../utils/validation');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
  try {
    fields = req.body || {};

    const requiredFields = {
      email: "Email",
      firstName: "First Name",
      lastName: "Last Name",
      hashedPassword: "Password",
      age: "Age",
      gender: "Gender",
      weight: "Weight",
      height: "Height"
    };

    if (checkMissingFields(res, fields, requiredFields)) return;

    const existingUser = await User.findOne({ email: fields.email });
    if (existingUser) {
      return res.status(409).json({ error: "A user with this email already exists." });
    }

    const user = await User.create(fields);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('currentDietPlan');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(req.params.userId).populate('currentDietPlan');

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (req.body.hashedPassword) {
      const saltRounds = 10;
      const hashed = await bcrypt.hash(req.body.hashedPassword, saltRounds);
      req.body.hashedPassword = hashed;
    }

    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCurrentUserDietPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentDietPlan } = req.body;

    if (!currentDietPlan) {
      return res.status(400).json({ error: 'No diet plan ID provided.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { currentDietPlan },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({
      message: 'Diet plan updated successfully.',
      currentDietPlan: updatedUser.currentDietPlan
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, updateCurrentUserDietPlan, getCurrentUser };
