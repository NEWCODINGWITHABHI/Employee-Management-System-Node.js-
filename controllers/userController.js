const bcrypt = require("bcrypt");
const express = require("express");
const randomString = require("randomstring");
const User = require("../models/userModel");
const res = require("express/lib/response");

const { hashPassword } = require("../utils/hashPassword");
const { sendVerifyMail } = require("../utils/sendVerifyMail");
const { sendResetPasswordMail } = require("../utils/sendResetPasswordMail");

async function userGetRegisterController(req, res) {
  try {
    console.log("register");
    res.render("register", { message: "" });
  } catch (error) {
    console.log(error);
  }
}

async function userPostRegisterController(req, res) {
  const { name, email, mobileno, password, image } = req.body;
  console.log(",,,,", req.body);

  try {
    const hashP = await hashPassword(password);
    const user = new User({
      name,
      email,
      mobileno,
      password: hashP,
      image,
      isAdmin: 0,
    });

    const userData = await user.save();
    if (userData) {
      sendVerifyMail(name, email, userData._id);
      res.render("register", {
        message:
          "Your registration has been successfully register , Please verify the mail",
      });
    } else {
      res.render("register", { message: "Your registration has been failed" });
    }
  } catch (error) {
    res.send(`database error${error}`);
  }
}

async function userVerifyMailController(req, res) {
  try {
    const updatedData = await User.updateOne(
      { _id: req.query.id },
      { $set: { isVerified: 1 } }
    );
    res.send("Email verified");
  } catch (error) {
    console.log(error.message);
  }
}

async function userGetLoginController(req, res) {
  try {
    res.render("login", { message: "" });
  } catch (error) {
    console.log(error.message);
  }
}

async function userPostLoginController(req, res) {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const isMatchPassword = await bcrypt.compare(password, userData.password);
      if (isMatchPassword) {
        if (userData.isVerified == 1) {
          req.session.user_id = userData._id;
          console.log("object", req.session.user_id, userData._id);
          res.redirect("/home");
        } else {
          res.render("login", { message: "Please verify the mail" });
        }
      } else {
        res.render("login", { message: "Password and email is not correct" });
      }
    } else {
      console.log("------else", userData, User, "check");
      res.render("login", { message: "User does not  exist" });
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function userGetHomeController(req, res) {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    return res.render("home", { user: userData });
  } catch (error) {
    console.log(error.message);
  }
}

async function userLogoutController(req, res) {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
}

async function userGetForgetController(req, res) {
  try {
    res.render("forget", { message: "" });
  } catch (error) {
    console.log(error.message);
  }
}

async function userPostForgetController(req, res) {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    if (userData) {
      if (userData.isVerified == 1) {
        const tokenString = await randomString.generate();
        const updatedData = await User.updateOne(
          { email: email },
          { $set: { token: tokenString } }
        );
        sendResetPasswordMail(userData.name, userData.email, tokenString);
        res.render("forget", {
          message: "Please check mail to reset password",
        });
      } else {
        res.render("forget", { message: "Please verify the mail" });
      }
    } else {
      res.render("forget", { message: "User email is not correct" });
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function userResetPasswordGetController(req, res) {
  const token = req.query.token;
  const tokenData = await User.findOne({ token: token });
  if (tokenData) {
    res.render("reset-password", { user_id: tokenData._id });
  } else {
    res.render("404", { message: "Token is invalid" });
  }
}

async function userResetPasswordPostController(req, res) {
  try {
    const { password, user_id } = req.body;
    console.log(req.body, "pppppp");
    const hashP = await hashPassword(password);
    const updatedData = await User.findByIdAndUpdate(
      { _id: user_id },
      { $set: { password: hashP, token: "" } }
    );
    console.log("reset password");
    res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
}

async function userGetVerification(req, res) {
  try {
    res.render("verification", { message: "" });
  } catch (error) {
    console.log(error.message);
  }
}

async function userPostVerification(req, res) {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    if (userData) {
      sendVerifyMail(userData.name, userData.email, userData._id);
      res.render("verification", {
        message: "Check mail to reset mail verification ",
      });
    } else {
      res.render("verification", { message: "User does not exist" });
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function userEditGetController(req, res) {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id });
    if (userData) {
      res.render("edit", { user: userData });
    } else {
      res.redirect("/home");
    }
  } catch (error) {
    console.log(error.message);
  }
}
async function userUpdatePostConroller(req, res) {
  try {
    const { name, email, mobileno, user_id, image } = req.body;
    console.log("----", name, email, mobileno, "-----");
    if (image) {
      const userData = await User.findByIdAndUpdate(
        { _id: user_id },
        { $set: { name, email, mobileno, image: image.file.filename } }
      );
    } else {
      const userData = await User.findByIdAndUpdate(
        { _id: req.session.user_id },
        { $set: { name, email, mobileno } }
      );
    }
    return res.redirect("/home");
  } catch (error) {
    console.log(error.message);
  }
  res.redirect("/home");
}
module.exports = {
  userGetRegisterController,
  userPostRegisterController,
  userGetLoginController,
  userPostLoginController,
  userGetHomeController,
  userVerifyMailController,
  userLogoutController,
  userGetForgetController,
  userPostForgetController,
  userResetPasswordGetController,
  userResetPasswordPostController,
  userGetVerification,
  userPostVerification,
  userEditGetController,
  userUpdatePostConroller,
};
