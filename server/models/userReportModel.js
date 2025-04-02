import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userReportSchema = new Schema({
    bin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WasteBin",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
        required: true
    },
    status: {
        type: String,
        enum: ["full", "damaged", "needs maintenance", "partially filled"],
        required: true
    },
    attachment: {
        type: String,  
        required: true
    },
    description: {
        type: String,  
        required: false  
    }
});  

export default mongoose.model("UserReport", userReportSchema);
