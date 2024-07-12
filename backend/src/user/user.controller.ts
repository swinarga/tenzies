import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import UserService from "./user.service";

class UserController {
	userService: UserService;

	constructor(userService: UserService) {
		this.userService = userService;
	}

	login = async (req: FastifyRequest, reply: FastifyReply) => {
		// @ts-ignore
		const { username, password } = req.body;

		const user = await this.getUserByUsername(username);

		const isMatch = user && bcrypt.compare(password, user.password);
		if (!user || !isMatch) {
			return reply.code(401).send({ message: "Invalid credentials" });
		}

		const payload = {
			id: user._id,
			name: user.username,
		};
		const token = req.jwt.sign(payload);
		reply.setCookie("access_token", token, {
			path: "/",
			httpOnly: true,
			secure: true,
		});
		return { accessToken: token };
	};

	logout = async (req: FastifyRequest, reply: FastifyReply) => {
		reply.clearCookie("access_token");
		return { message: "Logged out" };
	};

	getUsers = async (req: FastifyRequest, reply: FastifyReply) => {
		const users = await this.userService.getUsers();
		return users;
	};

	getUserById = async (req: FastifyRequest, reply: FastifyReply) => {
		// @ts-ignore
		const user = await this.userService.getUser({ _id: req.params.id });
		return user;
	};

	getUserByUsername = async (username: string) => {
		// @ts-ignore
		const user = await this.userService.getUser({ username: username });
		return user;
	};

	handleRegister = async (req: FastifyRequest, reply: FastifyReply) => {
		// @ts-ignore
		const { username, password } = req.body;

		const user = await this.userService.createUser({
			username,
			password: await bcrypt.hash(password, 10),
		});

		return reply.status(201).send({
			user: user,
		});
	};
}

export default UserController;
