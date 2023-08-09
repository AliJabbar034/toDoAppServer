 import mongoose from "mongoose";

 


 export const connectDatabase = async ()=>{
    const Db=process.env.MONGO_URL.replace('<password>', process.env.MONGO_PASS)
  
 try {
  const {connection}= await mongoose.connect(Db)

  console.log("Connected to Db");
 } catch (error) {
  
  console.log(error.message);
  process.exit(1);
 }

}
 

