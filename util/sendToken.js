export const sendToken=(res,user , statusCode, message)=>{

  const token = user.getJwtToken();
 
  
    const options={
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES *24 * 60  * 60 * 1000),
    httpOnly: true
  }
      const userData={
     
        id:user.id,
        name:user.name,
        email:user.email,
        avatar:user.avatar,
        tasks:user.tasks,
        verified:user.verified
    }
   
res.status(statusCode).cookie('token',token,options) .json({
    success: true,
    message,
    user:userData
})
} 