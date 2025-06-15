const mongoose = require("mongoose")
const bcrypt = require('bcrypt');

const mealLogSchema = new mongoose.Schema(
    {
        mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'meal', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        quantity: { type: Number },
        date: { type: Date },
        mealType: {
            type: String,
            enum: ['breakfast', 'lunch', 'dinner', 'snack'],
            required: true
        },
        notes: { type: String }

    }
);

module.exports = mongoose.model("mealLog", mealLogSchema);