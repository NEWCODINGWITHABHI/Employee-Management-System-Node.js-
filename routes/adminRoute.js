
const express=require("express");
const adminRoute=express();
const session=require("express-session");
const {SECRET_KEY}=require("../config/config");
const { adminLoginGetController, adminLoginPostController, adminHomeController, adminLogoutController, adminForgetGetController, adminverifyMailController, forgetPasswordGetController, resetPasswordPostController, adminDashboardGetController, addNewUserGetController, addNewUserPostController, editUserGetController, updateUserPostController, deleteUserGetController } = require("../controllers/adminController");
const {isLogin,isLogout}=require("../middlewares/adminAuth");

adminRoute.use(session({secret:SECRET_KEY}));
adminRoute.use(express.json());
adminRoute.use(express.urlencoded({extended:true}));

adminRoute.set("view engine","ejs");
adminRoute.set("views",'./views/admin');

const multer=require("multer");
const path=require("path");
adminRoute.use(express.static('public'))

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImage'));
    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})
const upload=multer({storage:storage});


adminRoute.get("/",isLogout,adminLoginGetController);
adminRoute.get("/login",isLogout,adminLoginGetController);
adminRoute.post("/login", adminLoginPostController);
adminRoute.post("/", adminLoginPostController);


adminRoute.get("/home",isLogin,adminHomeController);

adminRoute.get("/logout",isLogin,adminLogoutController);

adminRoute.get("/forget",isLogout,adminForgetGetController);
adminRoute.post("/forget",adminverifyMailController);

adminRoute.get("/forget-password",forgetPasswordGetController);

adminRoute.post("/forget-password",resetPasswordPostController);

adminRoute.get("/dashboard",isLogin,adminDashboardGetController);

adminRoute.get("/add-new-user",isLogin,addNewUserGetController);
adminRoute.post("/add-new-user",upload.single('image'),addNewUserPostController)

adminRoute.get("/edit-user",isLogin,editUserGetController);
adminRoute.post("/edit-user",updateUserPostController);

adminRoute.get("/delete-user",isLogin,deleteUserGetController);
// adminRoute.get("*",(req,res)=>{
//     res.render("login")
// })

module.exports=adminRoute;