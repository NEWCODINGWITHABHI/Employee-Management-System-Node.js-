const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;
async function connectDb() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Mongodb connected");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connectDb };
