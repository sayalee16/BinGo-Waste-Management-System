import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
//console.log(process.env.MONGO_URI); // Check if it's loaded correctly

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log(`We got the mongo!`);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
