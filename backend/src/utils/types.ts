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
	profileId: string;
};

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: UserPayload;
	}
}

export type User = {
	username: string;
	password: string;
	roles: string[];
};

export type CreateUser = {
	username: string;
	password: string;
};

export type UserDocument = Omit<User, "password"> & {
	_id: string;
};

export type UserDocumentWithPassword = User & {
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

export type Profile = {
	gameSessions: GameSession[];
	userId: string;
	username: string;
	isPrivate: boolean;
};

export type ProfileDocument = Profile & {
	_id: string;
};

export type UpdateProfile = {
	gameSessions?: GameSession[];
	isPrivate?: boolean;
};

export type GameSession = {
	rolls: number;
	time: number;
	datePlayed: Date;
};

export type GameSessionDocument = GameSession & {
	_id: string;
};

export type GetGameSessionFilter = {
	rolls?: number;
	time?: number;
	datePlayed?: Date;
};
