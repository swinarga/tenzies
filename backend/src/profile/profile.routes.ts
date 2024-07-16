import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import ProfileController from "./profile.controller";
import { checkValidIdMiddleware } from "../middleware/middleware";

class ProfileRouter {
	profileController: ProfileController;

	constructor(profileController: ProfileController) {
		this.profileController = profileController;
	}

	checkIsUserAuthorized = async (
		req: FastifyRequest<{
			Params: { id: string };
		}>,
		reply: FastifyReply
	) => {
		// Check if user is authorized to access the resource
		const profile = await this.profileController.getProfileById(req, reply);

		if (!profile) {
			return reply.code(404).send({ message: "Profile not found" });
		}

		// read only if user is not the owner of the profile and profile is not private
		if (req.method === "GET" && !profile.isPrivate) return;

		// https://stackoverflow.com/a/6937030
		if (!req.user)
			return reply.code(401).send({ message: "Not authenticated!" });
		if (profile.userId.toString() !== req.user.id) {
			return reply.code(403).send({ message: "Unauthorized" });
		}
	};

	routes = async (fastify: FastifyInstance) => {
		fastify.get("/", this.profileController.getProfiles);
		fastify.get(
			"/:id",
			{
				preHandler: [
					checkValidIdMiddleware,
					this.checkIsUserAuthorized,
				],
			},
			this.profileController.getProfileById
		);
		fastify.put(
			"/:id",
			{
				preHandler: [
					checkValidIdMiddleware,
					fastify.authenticate,
					this.checkIsUserAuthorized,
				],
			},
			this.profileController.updateProfile
		);
		fastify.log.info("user routes registered");
	};
}

export default ProfileRouter;
