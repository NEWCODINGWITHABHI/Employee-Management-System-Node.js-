const express = require("express");
const userRoute = express();
var cors = require("cors");

const {
  userGetRegisterController,
  userPostRegisterController,
  userVerifyMailController,
  userGetLoginController,
  userPostLoginController,
  userGetHomeController,
  userLogoutController,
  userGetForgetController,
  userResetPasswordGetController,
  userResetPasswordPostController,
  userPostForgetController,
  userGetVerification,
  userPostVerification,
  userEditGetController,
  userUpdatePostConroller,
} = require("../controllers/userController");

const { isLoginAuth, isLogoutAuth } = require("../middlewares/auth");
const session = require("express-session");
const { SECRET_KEY } = require("../config/config");
userRoute.set("view engine", "ejs");
userRoute.set("views", "views/users");

userRoute.use(
  session({
    secret: SECRET_KEY || "abhishekkumarsahni",
  })
);
userRoute.use(cors());
userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));
userRoute.use(express.static("public"));

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/userImages"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

userRoute.get("/", isLogoutAuth, (req, res) => {
  res.render("register", { message: "" });
});
userRoute.get("/user/register", isLogoutAuth, userGetRegisterController);

userRoute.post("/user/register", upload.single("image"), userPostRegisterController);

userRoute.get("/verify", userVerifyMailController);

userRoute.get("/login", isLogoutAuth, userGetLoginController);
userRoute.post("/login", userPostLoginController);

userRoute.get("/home", isLoginAuth, userGetHomeController);

userRoute.get("/logout", isLoginAuth, userLogoutController);

userRoute.get("/forget", isLogoutAuth, userGetForgetController);

userRoute.post("/forget", userPostForgetController);

userRoute.get("/reset-password", isLogoutAuth, userResetPasswordGetController);
userRoute.post("/reset-password", userResetPasswordPostController);

userRoute.get("/verification", userGetVerification);
userRoute.post("/verification", userPostVerification);

userRoute.get("/edit",isLoginAuth,userEditGetController)
userRoute.post("/edit",userUpdatePostConroller);

module.exports = userRoute;
