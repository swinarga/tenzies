import { FastifyRequest, FastifyReply } from "fastify";
import mongoose from "mongoose";

export async function checkValidIdMiddleware(
	req: FastifyRequest<{
		Params: {
			id: string;
		};
	}>,
	reply: FastifyReply
) {
	if (!mongoose.isValidObjectId(req.params.id)) {
		return reply
			.status(400)
			.send({ message: "ID must be 24 characters long" });
	}
}
