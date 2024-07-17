import { FastifyRequest, FastifyReply } from "fastify";
import mongoose from "mongoose";

export async function checkValidIdMiddleware(
	req: FastifyRequest<{
		Params: {
			id: string;
			profileId: string;
			gameId: string;
		};
	}>,
	reply: FastifyReply
) {
	if (req.params.id && !mongoose.isValidObjectId(req.params.id)) {
		return reply
			.status(400)
			.send({ message: "ID must be 24 characters long" });
	}

	if (
		req.params.profileId &&
		!mongoose.isValidObjectId(req.params.profileId)
	) {
		return reply
			.status(400)
			.send({ message: "Profile ID must be 24 characters long" });
	}

	if (req.params.gameId && !mongoose.isValidObjectId(req.params.gameId)) {
		return reply
			.status(400)
			.send({ message: "Game ID must be 24 characters long" });
	}
}
