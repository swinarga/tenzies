import mongoose from "mongoose";
import {
	User as IUser,
	UpdateUser,
	UserDocument,
	UserDocumentWithPassword,
	GetUserFilter,
} from "../utils/types";
import User from "./models/User";
import Profile from "./models/Profile";
import { UserDataSource } from "./interfaces/UserDataSource";

export default class MongoDBUserDataSource implements UserDataSource {
	constructor() {}

	async createUser(user: IUser): Promise<UserDocument> {
		const userId = new mongoose.Types.ObjectId();
		const profile = new Profile({
			_id: new mongoose.Types.ObjectId(),
			games: [],
			userId: userId,
			username: user.username,
			isPrivate: false,
		});
		const newUser = new User({
			_id: userId,
			...user,
			roles: ["user"],
			profile: profile,
		});
		await newUser.save();
		await profile.save();

		// TODO: dont return password
		const userDoc: UserDocument = newUser.toObject();

		return userDoc;
	}

	async getUser(filterObj: GetUserFilter): Promise<UserDocument | null> {
		const user = await User.findOne(filterObj).select("-__v -password");
		if (!user) return null;

		return user.toObject();
	}

	async getUserWithPassword(
		filterObj: GetUserFilter
	): Promise<UserDocumentWithPassword | null> {
		const user = await User.findOne(filterObj).select("-__v");
		if (!user) return null;

		return user.toObject();
	}

	async getUsers(): Promise<UserDocument[]> {
		const users = await User.find().select("-__v -password");

		return users.map((user) => user.toObject());
	}

	async updateUser(
		id: string,
		user: UpdateUser
	): Promise<UserDocument | null> {
		try {
			const updatedUser = await User.findOneAndUpdate({ _id: id }, user, {
				runValidators: true,
			});
			if (!updatedUser) return null;

			return updatedUser.toObject();
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async deleteUser(id: string): Promise<UserDocument | null> {
		// TODO: Delete profile as well

		const user = await User.findOneAndDelete({ _id: id });

		if (!user) return null;
		return user.toObject();
	}
}
