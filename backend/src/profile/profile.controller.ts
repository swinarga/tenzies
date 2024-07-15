import { FastifyReply, FastifyRequest } from "fastify";
import { ProfileDataSource } from "../database/interfaces/ProfileDataSource";
import { GameSession, UpdateProfile } from "../utils/types";

class ProfileController {
	profileDataSource: ProfileDataSource;

	constructor(profileDataSource: ProfileDataSource) {
		this.profileDataSource = profileDataSource;
	}

	getProfileById = async (
		req: FastifyRequest<{
			Params: { id: string };
		}>,
		reply: FastifyReply
	) => {
		const profile = await this.profileDataSource.getProfileById(
			req.params.id
		);
		return profile;
	};

	getProfiles = async (req: FastifyRequest, reply: FastifyReply) => {
		const profiles = await this.profileDataSource.getProfiles();
		return profiles;
	};

	updateProfile = async (
		req: FastifyRequest<{
			Params: { id: string };
			Body: UpdateProfile;
		}>,
		reply: FastifyReply
	) => {
		const { id } = req.params;
		const profile = req.body;
		console.log(profile);
		const updatedProfile = await this.profileDataSource.updateProfile(
			id,
			profile
		);

		return updatedProfile;
	};

	addGameSession = async (req: FastifyRequest, reply: FastifyReply) => {
		const gameSession = req.body as GameSession;

		const newGameSession = await this.profileDataSource.addGameSession(
			req.user.id,
			gameSession
		);

		if (!newGameSession)
			return reply.status(500).send({
				message: `Could not create game session record for user ${req.user.id}`,
			});

		return reply.status(200).send(newGameSession);
	};

	getGameSessions = async (
		req: FastifyRequest<{
			Params: { id: string };
		}>,
		reply: FastifyReply
	) => {
		const profileId = req.params.id;
		const gameSessions =
			await this.profileDataSource.getGameSessions(profileId);

		return reply.status(200).send(gameSessions);
	};

	deleteGameSession = async (
		req: FastifyRequest<{
			Params: { profileId: string; gameSessionid: string };
		}>,
		reply: FastifyReply
	) => {
		const profileId = req.params.profileId;
		const gameSessionId = req.params.gameSessionid;

		const gameSession = await this.profileDataSource.deleteGameSession(
			profileId,
			gameSessionId
		);

		if (!gameSession)
			reply.status(404).send({ message: "Game session not found" });

		return reply.status(200).send({
			message: "Game sessoin deleted",
			gameSession: gameSession,
		});
	};
}

export default ProfileController;
