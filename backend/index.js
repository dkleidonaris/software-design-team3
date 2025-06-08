require('dotenv').config({ path: './../.env' });
const express = require("express");
const cors = require('cors');
const app = express();

const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

const { apiRateLimiter } = require('./middleware/apiRateLimiter');

//ενεργοποίηση του cors για handling διαφορετικών Ports
app.use(cors());
app.use(express.json());
app.use('/api', apiRateLimiter);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => console.log("Database connection successfull")).catch((err) => {
    console.log(err);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});