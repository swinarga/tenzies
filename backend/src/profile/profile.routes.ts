import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import ProfileController from "./profile.controller";

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

		console.log("profile user ID: " + profile.userId);
		console.log("cookie user ID: " + req.user.id);
		console.log(
			"profile user ID type: " + typeof profile.userId.toString()
		);
		console.log("cookie user ID type: " + typeof req.user.id);
		if (profile.userId.toString() !== req.user.id) {
			return reply.code(401).send({ message: "Unauthorized" });
		}
	};

	routes = async (fastify: FastifyInstance) => {
		fastify.get("/", this.profileController.getProfiles);
		fastify.put(
			"/:id",
			{
				preHandler: [fastify.authenticate, this.checkIsUserAuthorized],
			},
			this.profileController.updateProfile
		);
		fastify.log.info("user routes registered");
	};
}

export default ProfileRouter;
