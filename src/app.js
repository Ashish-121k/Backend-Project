import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//cors se aaya hai, ye allow krta hai ki koi bhi requst aaye kisi bhi domain se toh usko allow krde, isse hume koi bhi cors error nhi aayega
app.use(cors({                                      
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb"}));                  //ye json data ko parse krta hai, limit 16kb ka hai
app.use(express. urlencoded({extended: true, limit:"16kb"}));  //jo bhi url ka data hota hai usko ye %20    hta ke show krta hai
app.use(express.static("public"));  //koi bhi file jo hum apne local server pe rakhna chate hai 
app.use(cookieParser());            //kisi user ke browser me jo cookie hoti hai usko parse krne ke liye
                                    //parse me kya hota hai ki koi data aata hai toh usko hum readable form me convert krte hai

export { app };