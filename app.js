 import express from 'express'
import userRouter from './routers/userRoute.js'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import { config } from "dotenv";

import { connectDatabase } from "./config/database.js";


const app = express();
 
const port =process.env.PORT || 5000;
 app.use(express.json());
 app.use(cookieParser());
 app.use(express.urlencoded({ extended: true }))
 app.use('/api/v1',userRouter); 
app.use(fileUpload({
    limits:{ fileSize : 50 *1024 * 1024},
    useTempFiles:true
}))
config({
    path:'./config/config.env'
})

app.use(cors())
app.use(cors({
    origin: '*'
}));
 

 await connectDatabase();
app.listen(port, ()=>{
    console.log("Server running on port " + port);
})
