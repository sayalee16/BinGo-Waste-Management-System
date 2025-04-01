import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: false,
	},
	password: {
		type: String,
		required: true,
	},
	phoneNo:{
		type:Number,
		required: true
	},
    isAdmin: {
        type:Boolean,
        default: false
    },
	location: {
        type: {
            type: String,    // "Point" for GeoJSON
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],   // [longitude, latitude]
            required: true
        }
    },
	ward: {
		type:String,
		require:true
	},
	zone:{
		type:String,
		require:true
	}
});


export default mongoose.model("User", userSchema);

