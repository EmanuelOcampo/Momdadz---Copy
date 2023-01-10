//import the express module
import express from "express"
const app = express();

//import the env module
import dotenv from "dotenv"
dotenv.config();

import 'express-async-errors'
import morgan from "morgan";


//mongodb connection and authenticate User
import mongoose from "mongoose";
import connectDB from "./db/connect.js";

//routers
import authRouter from "./routes/authRoutes.js"
import jobsRouter from "./routes/jobsRoutes.js"

//middleware if not found the link or request of user
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import {auth, isAdmin} from "./middleware/auth.js";


if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'))
}
app.use(express.json())

//response to home route
app.get("/", (req,  res) => {
    res.json({msg : "Welcome"});
})

app.get("/api/v1", (req,  res) => {
    res.json({msg : "Welcome"});
})

 
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", auth, jobsRouter)

//use the middleware error files
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
    try {
        mongoose.set('strictQuery', false)
        await connectDB(process.env.MONGO_URL)
        
        //port to open the back or access it
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`server is running on port ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();