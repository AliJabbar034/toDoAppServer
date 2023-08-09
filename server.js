import { config } from "dotenv";
import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import cloudinary from 'cloudinary'
const port =5000
config({
    path:'./config/config.env'
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

await connectDatabase();
app.listen(process.env.PORT || port, ()=>{
    console.log("Server running on port " , port);
})
