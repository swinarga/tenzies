import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { UserDataSource } from "../database/interfaces/UserDataSource";

class UserController {
	userDataSource: UserDataSource;

	constructor(userDataSource: UserDataSource) {
		this.userDataSource = userDataSource;
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
		const users = await this.userDataSource.getUsers();
		return users;
	};

	getUserById = async (req: FastifyRequest, reply: FastifyReply) => {
		// @ts-ignore
		const user = await this.userDataSource.getUser({ _id: req.params.id });
		return user;
	};

	getUserByUsername = async (username: string) => {
		// @ts-ignore
		const user = await this.userDataSource.getUser({ username: username });
		return user;
	};

	handleRegister = async (req: FastifyRequest, reply: FastifyReply) => {
		// @ts-ignore
		const { username, password } = req.body;

		const user = await this.userDataSource.createUser({
			username,
			password: await bcrypt.hash(password, 10),
		});

		return reply.status(201).send({
			user: user,
		});
	};

	deleteUser = async (req: FastifyRequest, reply: FastifyReply) => {
		// @ts-ignore
		const { id } = req.params;

		// TODO: handle delete user
		return reply.status(200).send({
			message: "test",
		});

		const user = await this.userDataSource.deleteUser(id);

		return reply.status(204);
	};
}

export default UserController;
