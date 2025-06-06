require('dotenv').config();
const express = require("express");
const cors = require('cors');
const app = express();

const mongoose = require("mongoose");
const userRoute = require("./routes/user");

//ενεργοποίηση του cors για handling διαφορετικών Ports
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoute);

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("Database connection successfull")).catch((err) => 
    {console.log(err);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});