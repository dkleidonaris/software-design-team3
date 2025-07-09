const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const dailyLogSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    date: { type: Date, required: true, default: () => new Date() },
    totalCalories: { type: Number, default: 0 },
    eatMorning: { type: Boolean, required: true, default: true },
    eatNoon: { type: Boolean, required: true, default: true },
    eatEvening: { type: Boolean, required: true, default: true },
    extraSnacks: [{ type: Schema.Types.ObjectId, ref: 'meal', default: [] }],
    notes: { type: String, default: '' },
});

module.exports = mongoose.model("dailyLog", dailyLogSchema);