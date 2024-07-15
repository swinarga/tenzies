import { Schema, model } from "mongoose";
import { GameSession } from "../../utils/types";

export const GameSessionSchema = new Schema({
	rolls: { type: Number, required: true },
	time: { type: Number, required: true },
	datePlayed: { type: Date, required: true },
});

export default model<GameSession>("GameSession", GameSessionSchema);
