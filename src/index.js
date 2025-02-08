import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./env"
});

connectDB()    //Approach: 2 (for database connection)
.then(()=>{
    //express se aaya hai, ye humne express application connect ki hai, isse phele humne bss mongo db connect diya tha
    app.listen(process.env.PORT || 8000, ()=> {
        console.log(`Server is running at port ${process.env.PORT}`);       
        
    })
})
.catch((err)=>{
    console.log('MONGO db connection failed !!!', err);
})





// Approach : 1 (for database connection)
/*

import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";

const app = express();

(async ()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

       app.on("error", (error)=>{               //express se aaya hai
        console.log("Errr:", error);
        throw error;
       })

       app.listen(process.env.PORT, ()=>{       //exprss se aaya hai
        console.log(`App is listening on port ${process.env.PORT}`);
       })


    } catch (error) {
        console.log('Error while connecting to the database', error);
        throw err;
    }
 })()

*/

/*
function connectDB(){   //connect to database 
     
} 
connectDB();

we can also write this function as an iffy function
(()=>{ })()

*/