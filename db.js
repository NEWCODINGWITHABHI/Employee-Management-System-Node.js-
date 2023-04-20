const mongoose = require("mongoose");
async function connectDb() {
  try {
    await mongoose.connect(
      "mongodb+srv://Abhicoder:NIQCqD8roc5O8EUm@cluster0.yg0yo6i.mongodb.net/empManagement"
    );

    console.log("Mongodb connected");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connectDb };
