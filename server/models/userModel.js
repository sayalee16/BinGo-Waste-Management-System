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
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: "user",
	},
    isAdmin: {
        type:Boolean,
        default: false
    }
});


export default mongoose.model("User", userSchema);

