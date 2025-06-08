const mongoose = require("mongoose")
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, },
        lastName: { type: String },
        email: { type: String, required: true, unique: true },
        hashedPassword: { type: String, required: true },
        age: { type: Number },
        gender: { type: String },
        weight: { type: Number },
        height: { type: Number },
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('hashedPassword')) return next(); // skip if not modified

    try {
        const saltRounds = 10;
        const hashed = await bcrypt.hash(this.hashedPassword, saltRounds);
        this.hashedPassword = hashed;
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("user", userSchema);