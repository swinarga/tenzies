import { JWT } from "@fastify/jwt";

declare module "fastify" {
	interface FastifyRequest {
		jwt: JWT;
	}
	export interface FastifyInstance {
		authenticate: any;
	}
}

type UserPayload = {
	id: string;
	name: string;
};

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: UserPayload;
	}
}

export type User = {
	username: string;
	password: string;
};

export type UserDocument = User & {
	_id: string;
};

export type GetUserFilter = {
	_id?: string;
	username?: string;
};

export type UpdateUser = {
	username?: string;
	password?: string;
};
