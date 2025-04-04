import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userReportSchema = new Schema({
    bin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WasteBin",
        required: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
        required: true
    },
    status: {
        type: String,
        enum: ["full", "damaged", "needs maintenance", "partially filled", "done"],
        required: true
    },
    attachment: {
        data: {
          type: Buffer,
          required: true,
        },
        contentType: {
          type: String,
          required: true,
        },
      },      
    description: {
        type: String,  
        required: false  
    },
    admin_status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    wc_status: {
        type: String,
        enum: ["pending", "done","recycled"],
        default: "pending"
    },
    
});  

export default mongoose.model("UserReport", userReportSchema);
