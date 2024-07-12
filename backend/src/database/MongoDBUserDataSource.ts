import {
	User as IUser,
	UpdateUser,
	UserDocument,
	GetUserFilter,
} from "../utils/types";
import User from "./models/User";
import { UserDataSource } from "./interfaces/UserDataSource";

export default class MongoDBUserDataSource implements UserDataSource {
	constructor() {}

	async createUser(user: IUser): Promise<UserDocument> {
		console.log(user);
		const newUser = new User({
			...user,
		});
		await newUser.save();
		const userDoc: UserDocument = newUser.toObject();

		return userDoc;
	}
	async getUser(filterObj: GetUserFilter): Promise<UserDocument | null> {
		const user = await User.findOne(filterObj).select("-__v");
		if (!user) return null;

		return user.toObject();
	}
	async getUsers(): Promise<UserDocument[]> {
		const users = await User.find().select("-__v");

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
		const user = await User.findOneAndDelete({ _id: id });

		if (!user) return null;
		return user.toObject();
	}
}
