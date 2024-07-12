import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import UserController from "./user.controller";

class UserRouter {
	userController: UserController;

	constructor(userController: UserController) {
		this.userController = userController;
	}

	checkUsernameExist = async (req: FastifyRequest, reply: FastifyReply) => {
		// @ts-ignore
		const { username } = req.body;
		const user = await this.userController.getUserByUsername(username);

		if (user) {
			return reply.code(422).send({
				message: "Username already exists",
			});
		}
	};

	routes = async (fastify: FastifyInstance) => {
		fastify.get(
			"/",
			{
				preHandler: [fastify.authenticate],
			},
			this.userController.getUsers
		);
		fastify.post(
			"/register",
			{
				preHandler: [this.checkUsernameExist],
				schema: {
					body: {
						type: "object",
						properties: {
							username: { type: "string" },
							password: { type: "string", minLength: 8 },
						},
						required: ["username", "password"],
					},
				},
			},
			this.userController.handleRegister
		);
		fastify.post(
			"/login",
			{
				schema: {
					body: {
						type: "object",
						properties: {
							username: { type: "string" },
							password: { type: "string" },
						},
						required: ["username", "password"],
					},
				},
			},
			this.userController.login
		);
		fastify.post("/logout", this.userController.logout);
		fastify.log.info("user routes registered");
	};
}

export default UserRouter;
