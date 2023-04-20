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

userRoute.get(
  "https://employee-management-system-n26m.onrender.com/",
  isLogoutAuth,
  (req, res) => {
    res.render("register", { message: "" });
  }
);
userRoute.get(
  "https://employee-management-system-n26m.onrender.com/register",
  isLogoutAuth,
  userGetRegisterController
);

userRoute.post(
  "https://employee-management-system-n26m.onrender.com/register",
  upload.single("image"),
  userPostRegisterController
);

userRoute.get(
  "https://employee-management-system-n26m.onrender.com/verify",
  userVerifyMailController
);

userRoute.get(
  "https://employee-management-system-n26m.onrender.com/login",
  isLogoutAuth,
  userGetLoginController
);
userRoute.post(
  "https://employee-management-system-n26m.onrender.com/login",
  userPostLoginController
);

userRoute.get(
  "https://employee-management-system-n26m.onrender.com/home",
  isLoginAuth,
  userGetHomeController
);

userRoute.get(
  "https://employee-management-system-n26m.onrender.com/logout",
  isLoginAuth,
  userLogoutController
);

userRoute.get(
  "https://employee-management-system-n26m.onrender.com/forget",
  isLogoutAuth,
  userGetForgetController
);

userRoute.post(
  "https://employee-management-system-n26m.onrender.com/forget",
  userPostForgetController
);

userRoute.get(
  "https://employee-management-system-n26m.onrender.com/reset-password",
  isLogoutAuth,
  userResetPasswordGetController
);
userRoute.post(
  "https://employee-management-system-n26m.onrender.com/reset-password",
  userResetPasswordPostController
);

userRoute.get(
  "https://employee-management-system-n26m.onrender.com/verification",
  userGetVerification
);
userRoute.post(
  "https://employee-management-system-n26m.onrender.com/verification",
  userPostVerification
);

userRoute.get(
  "https://employee-management-system-n26m.onrender.com/edit",
  isLoginAuth,
  userEditGetController
);
userRoute.post(
  "https://employee-management-system-n26m.onrender.com/edit",
  userUpdatePostConroller
);

module.exports = userRoute;
