import { Schema, model } from "mongoose";
import { User } from "../../utils/types";

export const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	roles: {
		type: [String],
		required: true,
	},
});

export default model<User>("User", UserSchema);
