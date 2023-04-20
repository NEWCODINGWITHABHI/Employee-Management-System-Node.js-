

const isLoginAuth=async(req,res,next)=>{
  try{
    console.log(req.session.user_id,"sessiion")
    if(req.session.user_id){
      
    }
    else{
      return res.redirect("/login");
    }
    next();
  }catch(error){
    console.log(error.message)
  }
}

const isLogoutAuth=async(req,res,next)=>{

    try{
  if(req.session.user_id){
    
   return  res.redirect("/home");
  }
  next();
    }catch(error){
        console.log(error.message);
    }
}

module.exports={isLoginAuth,isLogoutAuth}