const express = require("express");
const app = express();

const { connectDb } = require("./db");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.set("view engine", "ejs");
connectDb();
// app.get("/", (req, res) => {
//   console.log("api on Home page");
//   // res.send("home api");
//   res.render("home");
// });

app.use("/", userRoute);


app.use("/admin",adminRoute);

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
