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

		const user = await this.getUserWithPassword(username);

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

	getUserById = async (
		req: FastifyRequest<{
			Params: {
				id: string;
			};
		}>,
		reply: FastifyReply
	) => {
		const user = await this.userDataSource.getUser({
			_id: req.params.id,
		});
		return user;
	};

	getUserByUsername = async (username: string) => {
		const user = await this.userDataSource.getUser({ username: username });
		return user;
	};

	getUserWithPassword = async (username: string) => {
		const user = await this.userDataSource.getUserWithPassword({
			username: username,
		});
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

		const user = await this.userDataSource.deleteUser(id);

		if (!user) reply.status(404).send({ message: "User not found" });

		return reply.status(200).send({
			message: "User deleted",
			user: user,
		});
	};
}

export default UserController;
