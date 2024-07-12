// Import the framework and instantiate it
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import MongoDBUserDataSource from "./database/MongoDBUserDataSource";
import UserService from "./user/user.service";
import UserController from "./user/user.controller";
import UserRouter from "./user/user.routes";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const dbUri = process.env.DB_URI as string;
if (!dbUri) {
	console.error("DB_URI not specified in .env file");
	process.exit(1);
}

async function getMongoDS() {
	try {
		console.log("Attempting to connect to mongoDB");

		await mongoose.connect(process.env.DB_URI as string);
		console.log("Connected to MongoDB");

		return {
			userDataSource: new MongoDBUserDataSource(),
		};
	} catch (err) {
		// Logger.error(err);
		throw err;
	}
}

(async () => {
	try {
		const { userDataSource } = await getMongoDS();
		const fastify = Fastify({
			logger: true,
		});

		// jwt
		fastify.register(fjwt, { secret: process.env.JWT_SECRET as string });
		fastify.addHook("preHandler", (req, res, next) => {
			req.jwt = fastify.jwt;
			return next();
		});
		// cookies
		fastify.register(fCookie, {
			secret: process.env.COOKIE_KEY as string,
			hook: "preHandler",
		});

		fastify.decorate(
			"authenticate",
			async (req: FastifyRequest, reply: FastifyReply) => {
				const token = req.cookies.access_token;
				if (!token) {
					return reply
						.status(401)
						.send({ message: "Authentication required" });
				}
				// here decoded will be a different type by default but we want it to be of user-payload type
				const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
				req.user = decoded;
			}
		);
		const userService = new UserService(userDataSource);
		const userController = new UserController(userService);
		const userRouter = new UserRouter(userController);

		fastify.register(userRouter.routes, {
			prefix: "/api/users",
		});

		// Declare a route
		fastify.get("/health", async function handler(request, reply) {
			return { message: "success" };
		});

		try {
			fastify.listen({ port: 3000 }).then((address) => {});
		} catch (err) {
			fastify.log.error(err);
			process.exit(1);
		}
	} catch (err) {}
})();
