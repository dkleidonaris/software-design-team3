const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const mealSchema = new mongoose.Schema(
    {
        name: { type:String, required: true },
        calories: { type:Number, required: true },
        sugar: { type:Number, required: true },
        fat: { type:Number, required: true },
        protein: { type:Number, required: true },
        weight: { type:Number, required: true }, //g
        category: { type:String },
        items: [{ type:String }],
    }
);

module.exports = mongoose.model("meal", mealSchema);