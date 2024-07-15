import { GameSession, ProfileDocument, UpdateProfile } from "../../utils/types";

export interface ProfileDataSource {
	addGameSession(
		profileId: string,
		gameSession: GameSession
	): Promise<ProfileDocument | null>;
	getProfileById(profileId: string): Promise<ProfileDocument | null>;
	getProfiles(): Promise<ProfileDocument[]>;
	updateProfile(
		profileId: string,
		profile: UpdateProfile
	): Promise<ProfileDocument | null>;
	getGameSessions(profileId: string): Promise<GameSession[] | null>;
	deleteGameSession(
		profileId: string,
		gameSessionId: string
	): Promise<GameSession | null>;
}
