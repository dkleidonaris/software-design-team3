require('dotenv').config();
const express = require("express");
const cors = require('cors');
const app = express();

const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const dietPlanRoutes = require("./routes/dietPlan");
const dailyLogRoutes = require("./routes/dailyLog");
const mealRoutes = require("./routes/meal");

//ενεργοποίηση του cors για handling διαφορετικών Ports
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(3000, () => {
        console.log('Server running on \'http://localhost:3000\'!')
    }))
    .catch((err) => { console.log(err); });

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dietPlans", dietPlanRoutes);
app.use("/api/dailyLogs", dailyLogRoutes);
app.use("/api/meals", mealRoutes);