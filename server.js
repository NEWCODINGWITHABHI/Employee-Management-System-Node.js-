const express = require("express");
const app = express();
const dotenv=require("dotenv").config();

const { connectDb } = require("./db");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");


const PORT=process.env.PORT||5000
connectDb();


app.use("/public",express.static("public"));
app.use("/", userRoute);


app.use("/admin",adminRoute);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
