import { Schema, model, Types } from "mongoose";
import { Profile } from "../../utils/types";

export const GameSessionSchema = new Schema({
	rolls: { type: Number, required: true },
	time: { type: Number, required: true },
	datePlayed: { type: Date, required: true },
});

export const ProfileSchema = new Schema({
	gameSessions: {
		type: [GameSessionSchema],
		required: true,
	},
	userId: {
		type: Types.ObjectId,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	isPrivate: {
		type: Boolean,
		required: true,
		default: false,
	},
});

export default model<Profile>("Profile", ProfileSchema);