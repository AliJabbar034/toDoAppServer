import mongoose from "mongoose";
 import bcrypt from "bcrypt";
 import jwt from "jsonwebtoken";
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true   

    },
    email:{
   type:String,
   required:true,
   unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:[8,'Password must be at least 8 characters']
    },
    avatar:{
        public_id:String,
        url:String
    
    }
        ,
        created_at:{
            type:Date,
            default:Date.now()
        },
        passwardResetOtp:Number,
        passwardResetOtp_expiry:Date,
        
        verfied:{
            type:Boolean,
            default:false
        },
        otp:Number,
        otp_expiry:Date,
        tasks:[{
            title:String
            ,description:String,
            completed:Boolean,
            created_at:Date,

        }],
        
});

userSchema.index({
    otp_expiry:1 
},
{
    expireAfterSeconds:0
})
userSchema.pre('save', async function (next){
if(!this.isModified('password')){
    return next();}
  
   this.password=await bcrypt.hash(this.password,12)
   next(); 
  
})

userSchema.methods.getJwtToken=function(){
    const token=jwt.sign({ _id:this._id.toString() },process.env.JWT_SECRET,{expiresIn:
        process.env.JWT_COOKIE_EXPIRES * 24 * 60  * 60 * 1000})
    return token;
}

userSchema.methods.comparePassword=async function(password){
    const isMatch=await bcrypt.compare(password,this.password)
  
    return isMatch;
}

export var User=mongoose.model('User',userSchema);
