const mongoose = require("mongoose")
const bcrypt = require('bcrypt');

const mealSchema = new mongoose.Schema(
    {
        name: { type: String, },
        servingSize: { type: String },
        calories: { type: Number },
        sugar: { type: String, required: true, unique: true },
        fat: { type: String, required: true },
        protein: { type: Number },
        category: { type: String },
    }
);

module.exports = mongoose.model("meal", mealSchema);