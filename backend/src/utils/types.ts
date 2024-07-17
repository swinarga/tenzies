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
	profile: Profile;
};

export type CreateUser = {
	username: string;
	password: string;
};

export type UserDocument = Omit<User, "password"> & {
	_id: string;
	profile: ProfileDocument;
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
	games: Game[];
	userId: string;
	username: string;
	isPrivate: boolean;
};

export type ProfileDocument = Profile & {
	_id: string;
	games: GameDocument[];
};

export type UpdateProfile = {
	games?: Game[];
	isPrivate?: boolean;
};

export type Game = {
	rolls: number;
	time: number;
	datePlayed: Date;
};

export type GameDocument = Game & {
	_id: string;
};

export type GetGameFilter = {
	rolls?: number;
	time?: number;
	datePlayed?: Date;
};
