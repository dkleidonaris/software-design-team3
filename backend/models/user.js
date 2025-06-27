const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        hashedPassword: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ['male', 'female'], required: true },
        weight: { type: Number, required: true }, //kg
        height: { type: Number, required: true }, //cm
        currentDietPlan: { type: Schema.Types.ObjectID, ref: 'dietPlan' }
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