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

	isAdminCheck = async (req: FastifyRequest, reply: FastifyReply) => {
		// @ts-ignore
		const { user } = req;

		const adminUser = await this.userController.getUserByUsername(
			user.name
		);

		if (!adminUser || !adminUser.roles.includes("admin"))
			return reply.code(403).send({ message: "Forbidden" });
	};

	routes = async (fastify: FastifyInstance) => {
		fastify.get(
			"/",
			{
				preHandler: [fastify.authenticate, this.isAdminCheck],
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
		fastify.delete(
			"/:id",
			{
				schema: {
					params: {
						type: "object",
						properties: {
							id: {
								type: "string",
								pattern: "^[a-fA-F0-9]{24}$",
							},
						},
						required: ["id"],
					},
				},
				preHandler: [fastify.authenticate, this.isAdminCheck],
			},
			this.userController.deleteUser
		);
		fastify.log.info("user routes registered");
	};
}

export default UserRouter;
