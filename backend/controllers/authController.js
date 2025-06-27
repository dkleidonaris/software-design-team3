const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { checkMissingFields } = require('../utils/validation');

const login = async (req, res) => {
    try {
        fields = req.body || {};

        const requiredFields = {
            email: 'Email',
            password: 'Password'
        };

        if (checkMissingFields(res, fields, requiredFields)) return;

        const { email, password } = fields;

        const user = await User.findOne({ email: email });

        if (!user) {
            res.status(401).json({ error: "Invalid credentials were provided" })
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

        if (!passwordMatch) {
            res.status(401).json({ error: "Invalid credentials were provided" });
            return;
        }

        accessToken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.status(200).json({ accessToken: accessToken });
    } catch (err) {
        res.status(500).json(err.message);
    }
}

const checkAuthStatus = async (req, res) => {
    res.status(200).json(req.user );
};

module.exports = {
    login,
    checkAuthStatus
};