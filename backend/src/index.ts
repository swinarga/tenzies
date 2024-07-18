import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import cors from "@fastify/cors";
import fCookie from "@fastify/cookie";
import MongoDBUserDataSource from "./database/MongoDBUserDataSource";
import UserController from "./user/user.controller";
import UserRouter from "./user/user.routes";
import MongoDBProfileDataSource from "./database/MongoDBProfileDataSource";
import ProfileController from "./profile/profile.controller";
import ProfileRouter from "./profile/profile.routes";

dotenv.config({
	path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env",
});

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
			profileDataSource: new MongoDBProfileDataSource(),
		};
	} catch (err) {
		throw err;
	}
}

(async () => {
	try {
		const { userDataSource, profileDataSource } = await getMongoDS();
		const fastify = Fastify({
			logger: true,
		});

		await fastify.register(cors, {
			origin: process.env.FRONTEND_URL,
			credentials: true,
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
		const userController = new UserController(userDataSource);
		const userRouter = new UserRouter(userController);

		const profileController = new ProfileController(profileDataSource);
		const profileRouter = new ProfileRouter(profileController);

		fastify.register(userRouter.routes, {
			prefix: "/api/users",
		});
		fastify.register(profileRouter.routes, {
			prefix: "/api/profiles",
		});

		// Declare a route
		fastify.get("/health", async function handler(request, reply) {
			return { message: "success" };
		});

		try {
			fastify
				.listen({
					host: (process.env.HOST as string) || "0.0.0.0",
					port: parseInt(process.env.PORT as string) || 3000,
				})
				.then((address) => {});
		} catch (err) {
			fastify.log.error(err);
			process.exit(1);
		}
	} catch (err) {}
})();
