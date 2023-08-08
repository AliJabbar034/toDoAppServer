
import {User} from '../models/users.js';
import { sendMail } from '../util/sendMail.js';
import { sendToken } from '../util/sendToken.js';
import cloudinary from 'cloudinary'
// import fs from 'fs';
export const register = async(req,res)=>{
    try {
       const {name,email,password}=req.body; 
      

       const  avatar=req.files.avatar.tempFilePath;
      
       if(!name ||!email ||!password ||!avatar){
        return res.status(400).json({msg:"Please fill all the fields"});
       }

       let user=await User.findOne({email});

       if(user){
        return res.status(400).json({msg:"Email already exists"});
       }

        const otp=Math.floor(Math.random() * 100000 );
       
        const myCloud=await cloudinary.v2.uploader.upload(avatar,{
          folder:"toDoApp"
         })

         // fs.rmSync("./tmp",{ recursive :true})
        
       user =await User.create({name,email ,password,avatar:{
        public_id:myCloud.public_id,
        url:myCloud.secure_url
       }, otp , otp_expiry: Date.now() + process.env.OTP_EXPIRY * 60 * 1000});

  await sendMail(
    
        email,
        
      'OTP for your account',
       `Your OTP is ${otp}`
    
  )
console.log('Sent email');

  sendToken(res,user,200,"OTP send to your mail .please verify it" )

 
    } catch (error) {
        return res.status(400).json({
            succcess: false
            ,msg:error.message});
        
    }
}
export const verify=async (req, res) => {

  try {
    const otp=Number(req.body.otp);
    console.log(req.user._id);
    const user=await User.findOne(req.user._id);
   
    if(user.otp !== otp || user.otp_expiry < Date.now())
  {
 return res.status(404).json({
  succcess:false,
  message:'invalid otp '
})}

user.verfied = true
user.otp=null,
user.otp_expiry = null

await user.save();
sendToken(res,user,200,'Acount Verified Success') 

    
  } catch (error) {
    
  }
}


export const login=async (req, res) => {

  try {
    const {email,password}=req.body;
   
    const user=await User.findOne({email}).select('password');
   
    if(!user)
  {
 return res.status(404).json({
  succcess:false,
  message:'invalid Email or Password '
})}
console.log(password);
const isMatch= await user.comparePassword(password);
console.log(isMatch);
if(!isMatch){
  return res.status(404).json({
    succcess:false,
    message:'Incorrect Password'
  })
}


sendToken(res,user,200,'Login Success') 

    
  } catch (error) {
    
  }
}

export const logOut=async function (req, res)  {
 
  try {
    res.status(200).cookie("token",null ,
    {
      expires:new Date(Date.now())
    }
    ).json({msg:"Logout Successfully"});   
  } catch (error) {
   console.log('Error: ' + error);
  }
}




export const addTask= async function (req,res){
  try {
    const {title,description} =req.body;
   
    const user= await User.findById(req.user._id);
  
 
    console.log(user.tasks);
   user.tasks.push({
    title,
    description ,
     completed:false ,
    created_at: new Date( Date.now() )
    
    }); 
   console.log(user.tasks);
   
   await user.save();

console.log('save');
   res.status(200).json({
    succcess:true,
    message:'Task Added Successfully'
   })
  } catch (error) {
    
  }
}

export const removeTask= async function (req,res){  
  try {
    const {taskId} =req.params;
    const user =await User.findById(req.user._id);

   user.tasks= user.tasks.filter(task => task._id.toString() !== taskId.toString());
    
    await user.save();

   res.status(200).json({
    succcess:true,
    message:'Task Removed Successfully'
   })
  } catch (error) {
    
  }
}


export const updateTask= async function (req,res){
  try {
    const { taskId } = req.params;
   console.log(req.user._id);
    const user= await User.findById(req.user._id);
     
    user.task= user.tasks.find(
      (task) => task._id.toString() ===taskId.toString()
      );
    console.log(user.task);
    user.task.completed =!user.task.completed;
   await user.save();

   res.status(200).json({
    succcess:true,
    message:'Task updated Successfully'
   })
  } catch (error) {
    
  }
}


export const getMyProfile=async function (req, res)  {
 
  try {
   
    const user = await User.findById(req.user._id);

    sendToken(res, user , 200 , `Welcom back ${user.name} `)
    

  } catch (error) {
   console.log('Error: ' + error);
  }
}


export const updatePassword=async function (req, res)  {
 
  try {
   
    const user = await User.findById(req.user._id).select("+password");

    const {oldPassword,newPassword} =req.body;
    if(!oldPassword || !newPassword) {
      res.status(404).json({
        succcess:false,
        message:'Please provide old password and new password'
      })
    }
    const isMatch = await user.comparePassword(oldPassword)
    if(!isMatch) {
      res.status(404).json({
        succcess:false,
        message:'Invalid Old Password'
      })
    }

    user.password = newPassword

   await user.save();
res.status(200).json({
  succcess:true,
  message:'Password updated successfully'
})

  } catch (error) {
   console.log('Error: ' + error);
  }
}



export const updateProfile=async function (req, res)  {
 
  try {
    const {name} =req.body;
   const avatar =req.files.avatar.tempFilePath;
    const user = await User.findById(req.user._id);
 
    
    if(name)   user.name = name;   
    if(avatar){
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      const myCloud=await cloudinary.v2.uploader.upload(avatar,{
        folder:"toDoApp"
       })

       fs.rmSync("./tmp",{ recursive :true});
       user.avatar={
        public_id:myCloud.public_id,
        url:myCloud.secure_url
       }
    }
  
    await user.save();


   

   res.status(200).json({
    succcess:true,
    message:'updated successfully'
  })


  } catch (error) {
   console.log('Error: ' + error);
  }
}

export const forgetPassword=async function (req, res)  {
 
  try {
    const {email} =req.body;
    

  
    if(!email) {
      res.status(404).json({
        succcess:false,
        message:'Please provide email address'
      })
    }
    const user = await User.findOne({email});
    if(!user){
      res.status(404).json({
        succcess:false,
        message:'Invalid Email'})
    }
const passwardResetOtp =Math.floor(Math.random() * 1000);

user.passwardResetOtp =passwardResetOtp;
user.passwardResetOtp_expiry= Date.now() + 10 *60 *1000;
user.save();

const message=`Your otp for reset password is ${passwardResetOtp}. if you did not request for changing password, please please try again ignoring this it `;

await sendMail( email,message)
console.log('Sent email');


res.status(200).json({
  succcess:true,
  message:`Otp sent to ${email}`
})

  } catch (error) {
   console.log('Error: ' + error);
  }
}

export const resetPassword=async (req, res) => {

  try {
    const { otp , password }=req.body;
   if(!otp || !password){
    res.status(401).json({
      succcess:false,
      message:'Please provide otp and password'
    })
   }
    const user=await User.findOne({passwardResetOtp:otp,
      passwardResetOtp_expiry:{$gt:Date.now()}
    }).select("+password");
   
    if(!user)
  {
 return res.status(404).json({
  succcess:false,
  message:'invalid otp '
})}

user.password = password;
user.passwardResetOtp=null,
user.passwardResetOtp_expiry = null
res.status(200).json({
  succcess:true,
  message:'Password updated successfully' 
})
await  user.save()

    
  } catch (error) {
    
  }
}

