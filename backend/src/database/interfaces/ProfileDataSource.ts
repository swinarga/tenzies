import {
	Game,
	GameDocument,
	ProfileDocument,
	UpdateProfile,
} from "../../utils/types";

export interface ProfileDataSource {
	addGame(profileId: string, game: Game): Promise<ProfileDocument | null>;
	getProfileById(profileId: string): Promise<ProfileDocument | null>;
	getProfiles(): Promise<ProfileDocument[]>;
	updateProfile(
		profileId: string,
		profile: UpdateProfile
	): Promise<ProfileDocument | null>;
	getGames(profileId: string): Promise<GameDocument[] | null>;
	deleteGame(profileId: string, gameId: string): Promise<GameDocument | null>;
}
