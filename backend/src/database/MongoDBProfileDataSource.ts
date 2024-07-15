import { GameSession, ProfileDocument, UpdateProfile } from "../utils/types";
import Profile from "./models/Profile";
import { ProfileDataSource } from "./interfaces/ProfileDataSource";

export default class MongoDBProfileDataSource implements ProfileDataSource {
	constructor() {}

	async getProfileById(profileId: string): Promise<ProfileDocument | null> {
		const profile = await Profile.findOne({ _id: profileId }).select(
			"-__v"
		);

		if (!profile) return null;

		return profile.toObject();
	}

	async getProfiles(): Promise<ProfileDocument[]> {
		const profiles = await Profile.find({ isPrivate: false }).select(
			"-__v"
		);
		return profiles.map((profile) => profile.toObject());
	}

	async updateProfile(
		profileId: string,
		profile: UpdateProfile
	): Promise<ProfileDocument | null> {
		const updatedProfile = await Profile.findOneAndUpdate(
			{ _id: profileId },
			{
				isPrivate: profile.isPrivate,
				gameSessions: profile.gameSessions,
			},
			{ returnDocument: "after" }
		).select("-__v");

		if (!updatedProfile) return null;

		return updatedProfile.toObject();
	}

	// TODO: implement route to add game session
	async addGameSession(
		profileId: string,
		gameSession: GameSession
	): Promise<ProfileDocument | null> {
		const profile = await Profile.findOneAndUpdate(
			{ _id: profileId },
			{ $push: { gameSessions: gameSession } },
			{ returnDocument: "after" }
		).select("-__v");

		if (!profile) return null;

		return profile.toObject();
	}

	// TODO: implement route to add game session
	async getGameSessions(profileId: string): Promise<GameSession[] | null> {
		const profile = await Profile.findOne({ _id: profileId }).select(
			"-__v"
		);

		if (!profile) return null;

		return profile.toObject().gameSessions;
	}

	// TODO: implement route to add game session
	async deleteGameSession(
		profileId: string,
		gameSessionId: string
	): Promise<GameSession | null> {
		const profile = await Profile.findOne({ _id: profileId }).select(
			"-__v"
		);

		if (!profile) return null;

		throw new Error("Method not implemented.");
	}
}
