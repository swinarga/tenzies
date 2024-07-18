import { FastifyReply, FastifyRequest } from "fastify";
import { ProfileDataSource } from "../database/interfaces/ProfileDataSource";
import { Game, UpdateProfile } from "../utils/types";
import moment from "moment";

class ProfileController {
	profileDataSource: ProfileDataSource;

	constructor(profileDataSource: ProfileDataSource) {
		this.profileDataSource = profileDataSource;
	}

	getProfileById = async (
		req: FastifyRequest<{
			Params: { id: string; profileId: string };
		}>,
		reply: FastifyReply
	) => {
		const profile = await this.profileDataSource.getProfileById(
			req.params.id ? req.params.id : req.params.profileId
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

	addGame = async (
		req: FastifyRequest<{
			Body: Omit<Game, "datePlayed"> & { datePlayed: number };
			Params: {
				profileId: string;
			};
		}>,
		reply: FastifyReply
	) => {
		const body = req.body;

		if (!moment(body.datePlayed).isValid())
			return reply.status(400).send({
				message: "Invalid date format",
			});

		const game = {
			...body,
			datePlayed: moment(body.datePlayed).toDate(),
		};

		const profileId = req.params.profileId;

		const newGame = await this.profileDataSource.addGame(profileId, game);

		if (!newGame)
			return reply.status(500).send({
				message: `Could not create game session record for user profile ${req.params.profileId}`,
			});

		return reply.status(201).send(newGame);
	};

	getGames = async (
		req: FastifyRequest<{
			Params: { profileId: string };
		}>,
		reply: FastifyReply
	) => {
		const profileId = req.params.profileId;
		const games = await this.profileDataSource.getGames(profileId);

		if (!games) {
			return reply.status(404).send({
				message: `User profile ${profileId} not found`,
			});
		}

		return reply.status(200).send(games);
	};

	deleteGame = async (
		req: FastifyRequest<{
			Params: { profileId: string; gameId: string };
		}>,
		reply: FastifyReply
	) => {
		const profileId = req.params.profileId;
		const gameId = req.params.gameId;

		const game = await this.profileDataSource.deleteGame(profileId, gameId);

		if (!game)
			reply.status(404).send({ message: "Game session not found" });

		return reply.status(200).send({
			message: "Game session deleted",
			game: game,
		});
	};
}

export default ProfileController;
