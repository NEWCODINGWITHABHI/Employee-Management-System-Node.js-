const express = require("express");
const app = express();

const { connectDb } = require("./db");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");



connectDb();


app.use("/", userRoute);


app.use("/admin",adminRoute);

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
