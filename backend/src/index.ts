// Import the framework and instantiate it
import Fastify from "fastify";
import dotenv from "dotenv";
import mongoose from "mongoose";
import LoginRoute from "./routes/login";

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

		// TODO: Implement the MongoDBDataSources
		// return {
		// 	filesDataSource: new MongoDBFilesDataSource(),
		// 	subscriptionsDataSource: new MongoDBSubscriptionsDataSource(),
		// };
	} catch (err) {
		// Logger.error(err);
		throw err;
	}
}

(async () => {
	try {
		await getMongoDS();
		const fastify = Fastify({
			logger: true,
		});

		fastify.register(LoginRoute);

		// Declare a route
		fastify.get("/", async function handler(request, reply) {
			return { hello: "world" };
		});

		// Run the server!
		try {
			fastify.listen({ port: 3000 }).then((address) => {
				// fastify.log.info(`server listening on ${address}`);
			});
		} catch (err) {
			fastify.log.error(err);
			process.exit(1);
		}
	} catch (err) {}
})();
