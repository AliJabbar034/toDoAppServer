import { json } from "express";
import { User } from "../models/users.js";
import jwt from 'jsonwebtoken'


export const isAuthenticated =async (req, res,next)=>{
  try {
    const token =req.cookies.token;
    console.log(typeof token);
   
    if(!token){
        return  res.status(401).json({success:false ,message:'Login required'
    })}

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
   
    next()
  } catch (error) {
    

    console.log('error dring Authentication: ' + error.message);
  }

    
}