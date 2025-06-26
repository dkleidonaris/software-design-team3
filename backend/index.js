require('dotenv').config();
const express = require("express");
const cors = require('cors');
const app = express();

const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const mealRoutes = require("./routes/meal");

const { apiRateLimiter } = require('./middleware/apiRateLimiter');
const { authMiddleware } = require('./middleware/authMiddleware');

//ενεργοποίηση του cors για handling διαφορετικών Ports
app.use(cors());
app.use(express.json());
app.use('/api', apiRateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meals", authMiddleware, mealRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => console.log("Database connection successfull")).catch((err) => {
    console.log(err);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});