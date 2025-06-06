const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

//gia na testaroume mono - dinei olous tous users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;