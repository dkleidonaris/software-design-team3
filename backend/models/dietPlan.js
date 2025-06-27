const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const dietPlanSchema = new mongoose.Schema(
    {
        title: { type:String, required: true },
        description: { type:String },
        targetGoal: { type:Number, required: true },
        baseTdee: { type:Number},
        schedule: [
            {
                day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
                timeOfDay: { type: String, enum: ['morning', 'noon', 'evening', 'snack'] },
                meal: {type: Schema.Types.ObjectId, ref: 'meal'}
            }
        ]
    }
);

module.exports = mongoose.model("dietPlan", dietPlanSchema);