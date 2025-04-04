import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phoneNo:{
		type:String,
		required: true
	},
	password: {
		type: String,
		required: true,
	},
	
    isAdmin: {
        type:Boolean,
       default: false
     },
	location: {
        type: {
            type: String,    // "Point" for GeoJSON
            enum: ['Point'], 
            required: false        },
        coordinates: {
            type: [Number],   // [longitude, latitude]
            required: false
        }
    },
	ward: {
		type:String,
		require:false
	},
	zone:{
		type:String,
		require:false
	},
	isWasteCollector: {
		type:Boolean,
	 default: false
 	},
 	points: {
		type: Number,
		default: 2,
		min: 0 
	},
	blacklisted: {
			type: Boolean,
			default: false
	}

	
});


export default mongoose.model("User", userSchema);

