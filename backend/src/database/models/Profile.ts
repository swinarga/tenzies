import { Schema, model, Types } from "mongoose";
import { Profile } from "../../utils/types";

export const GameSchema = new Schema(
	{
		rolls: { type: Number, required: true },
		time: { type: Number, required: true },
		datePlayed: { type: Date, required: true },
	},
	{
		toObject: {
			transform: function (doc, obj) {
				// Convert date to milliseconds since epoch
				// when converting document to object for response
				obj.datePlayed = obj.datePlayed.getTime();
			},
		},
	}
);

export const ProfileSchema = new Schema({
	games: {
		type: [GameSchema],
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
