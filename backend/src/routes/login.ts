import { FastifyInstance, RouteOptions } from "fastify";

async function routes(fastify: FastifyInstance, options: RouteOptions) {
	fastify.post("/login", async (request, reply) => {
		// do login
		return { hello: "wassup" };
	});
}

export default routes;
