const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileno: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required:false,
  },
  isAdmin: {
    type: Number,
    required: true,
  },
  isVerified: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
});

module.exports = new mongoose.model("User", userSchema);
