import mongoose from "mongoose";
const Schema = mongoose.Schema;

const wasteBinSchema = new Schema({
    totalCapacity: {
        type: Number,
        required: true
    },


    realTimeCapacity: {
        type: Number,
        required: true
    },
    approxTimeToFill: {
        type: Number,  
        required: true
    },
    lastEmptiedAt: {
        type: Date,
        required: true
    },
    
    location: {
        type: {
            type: String,   
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    binType: {
        type: String,
        enum: ["public", "residential", "industrial"],
        required: false
    },
    category: {
        type: String,
        enum: ["plastic", "wet", "dry"],
        required: true
    },
    status: {
        type: String,
        enum: ["filled", "recycled", "partially filled"],
        required: true
    },
    sensorEnabled: {
        type: Boolean,
        required: true
    },  
    ward: {
        type: String,
        required: true
    },
    zone: {
        type: String,
        required: true
    }
});

export default mongoose.model("WasteBin", wasteBinSchema);
