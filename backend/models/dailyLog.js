const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const dailyLogSchema = new mongoose.Schema(
    {
        user: { type: Schema.Types.ObjectID, ref: 'user' },
        date: { type:Date, required: true },
        totalCalories: { type:Number, required: true },
        eatMorning: { type:Boolean, required: true },
        eatNoon: { type:Boolean, required: true },
        eatEvening: { type:Boolean, required: true },
        extraSnacks: [{type: Schema.Types.ObjectID, ref: 'user'}],
        notes: { type:String },
    }
);

module.exports = mongoose.model("dailyLog", dailyLogSchema);