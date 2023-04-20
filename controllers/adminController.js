const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const randomString = require("randomstring");
const { sendResetPasswordAdmin } = require("../utils/sendResetPasswordAdmin");
const { hashPassword } = require("../utils/hashPassword");
const {addNewUserMail}=require("../utils/addNewUserMail")

function adminLoginGetController(req, res) {
  try {
    res.render("login", { message: "" });
  } catch (error) {
    console.log(error.message);
  }
}

async function adminLoginPostController(req, res) {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    if (userData) {
      const isPasswordMatch = await bcrypt.compare(password, userData.password);
      if (isPasswordMatch) {
        if (userData.isAdmin == 1) {
          req.session.user_id = userData._id;
          return res.redirect("/admin/home");
        } else {
          res.render("login", { message: "You are not admin" });
        }
      } else {
        res.render("login", { message: "Email or password incorrect" });
      }
    } else {
      res.render("login", { message: "admin does not exist" });
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function adminHomeController(req, res) {
  try {
    const id = req.session.user_id;
    const adminData = await User.findById({ _id: id });
    res.render("home", { adminData });
  } catch (error) {
    console.log(error.message);
  }
}

async function adminLogoutController(req, res) {
  try {
    req.session.destroy();
    res.redirect("/admin/login");
  } catch (error) {
    console.log(error.message);
  }
}

async function adminForgetGetController(req, res) {
  try {
    console.log("object");
    res.render("forget", { message: "" });
  } catch (error) {
    console.log(error.message);
  }
}

async function adminverifyMailController(req, res) {
  try {
    const { email } = req.body;

    const userData = await User.findOne({ email });
    if (userData) {
      if (userData.isAdmin == 1) {
        const tokenString = await randomString.generate();
        const updateData = await User.updateOne(
          { email },
          { $set: { token: tokenString } }
        );
        sendResetPasswordAdmin(userData.name, userData.email, tokenString);
        res.render("forget", {
          message: "Please check mail for reset the password",
        });
      } else {
        res.render("forget", { message: "Admin is not valid" });
      }
    } else {
      res.render("forget", { message: "Email does not exist" });
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function forgetPasswordGetController(req, res) {
  try {
    const token = req.query.token;
    const userData = await User.findOne({ token: token });
    if (userData) {
      res.render("forget-password", { user_id: userData._id });
    } else {
      res.render("404", { message: "Invalid URL" });
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function resetPasswordPostController(req, res) {
  try {
    console.log(req.body, "forget-password");
    const { password, user_id } = req.body;

    const hashP = await hashPassword(password);

    const updatedData = await User.findByIdAndUpdate(
      { _id: user_id },
      { password: hashP, token: "" }
    );
    res.redirect("/admin/login");
  } catch (error) {
    console.log(error.message);
  }
}

async function adminDashboardGetController(req, res) {
  try {
    const users = await User.find({ isAdmin:0 });

    res.render("dashboard", { users });
  } catch (error) {
    console.log(error.message);
  }
}

async function addNewUserGetController(req,res){
  try{
   
    res.render("addNewUser",{message:""});
  }catch(error){
    console.log(error.message);
  }
}

async function addNewUserPostController(req,res){
   try{
   const {name,email,mobileno,image}=req.body;

 
    
  
   const password=randomString.generate(8);
   const hashP=await hashPassword(password);

   const user=new User({
    name,
    email,
    mobileno,
    image,
    password:hashP,
    isAdmin:0,
   })
  
   const userdata=await user.save();

   if(userdata){
    addNewUserMail(name,email,password,userdata._id);
    return  res.redirect("/admin/dashboard");
   }
   else{
    res.render("addNewUser",{Message:"Something went wrong"})
   }

   }catch(error){
    console.log(error.message)
   }
}

async function editUserGetController(req,res){
  try{

    const id=req.query.id;
    console.log("----",id,"-----")

    const userData=await User.findById({_id:id});
   if(userData){
     console.log(userData)
     res.render("edit-user",{user:userData});
   }
   else{
    res.redirect("/admin/dashboard");
   }
  }catch(error){
    console.log(error.message);
  }
}

async function updateUserPostController(req,res){
 try{
  const {name,email,mobileno,verify}=req.body;
  const id=req.body.id;
  console.log(name,mobileno,verify,id);


  const userData=await User.findByIdAndUpdate({_id:id},{$set:{name,mobileno,email,isVerified:verify}})
  res.redirect("/admin/dashboard");

 }catch(error){
  console.log(error.message);
 }
}

async function deleteUserGetController(req,res){
try{
  const id=req.query.id;

  const deleteData=await User.deleteOne({_id:id});
  res.redirect("/admin/dashboard");

}catch(error){
  console.log(error.message);
}
}
module.exports = {
  adminLoginGetController,
  adminLoginPostController,
  adminHomeController,
  adminLogoutController,
  adminForgetGetController,
  adminverifyMailController,
  forgetPasswordGetController,
  resetPasswordPostController,
  adminDashboardGetController,
  addNewUserGetController,
  addNewUserPostController,
  editUserGetController,
  updateUserPostController,
  deleteUserGetController
};
