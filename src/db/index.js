import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        // mongoose give an return object so we can store in variable
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
        // console.log("COnnection INSTANCE",connectionInstance)
    } catch (error) {
        console.log("MONGODB connection Failed", error);
        process.exit(1) 
        // read about process.exit() method
    }
}


export default connectDB