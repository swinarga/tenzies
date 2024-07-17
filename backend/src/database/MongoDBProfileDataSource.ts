import {
	Game,
	GameDocument,
	ProfileDocument,
	UpdateProfile,
} from "../utils/types";
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
				games: profile.games,
			},
			{ returnDocument: "after" }
		).select("-__v");

		if (!updatedProfile) return null;

		return updatedProfile.toObject();
	}

	async addGame(
		profileId: string,
		game: Game
	): Promise<ProfileDocument | null> {
		const profile = await Profile.findOneAndUpdate(
			{ _id: profileId },
			{ $push: { games: game } },
			{ returnDocument: "after" }
		).select("-__v");

		if (!profile) return null;

		return profile.toObject();
	}

	async getGames(profileId: string): Promise<GameDocument[] | null> {
		const profile = await Profile.findOne({ _id: profileId }).select(
			"-__v"
		);

		if (!profile) return null;

		return profile.toObject().games as GameDocument[];
	}

	// TODO: implement route to add game session
	async deleteGame(
		profileId: string,
		gameId: string
	): Promise<GameDocument | null> {
		const profile = await Profile.findOne({ _id: profileId }).select(
			"-__v"
		);

		if (!profile) return null;

		const games = profile.games as GameDocument[];
		const index = games.findIndex((game) => game._id.toString() === gameId);

		if (index === -1) return null;

		// remove game from games array
		const game = games.splice(index, 1);

		// update profile with new games array
		profile.games = games;
		await profile.save();

		return game[0];
	}
}
