import { UserDataSource } from "../database/interfaces/UserDataSource";
import { GetUserFilter } from "../utils/types";

class UserService {
	userDataSource: UserDataSource;

	constructor(userDataSource: UserDataSource) {
		this.userDataSource = userDataSource;
	}

	createUser = async (user: any) => {
		return await this.userDataSource.createUser(user);
	};

	getUser = async (filterObj: GetUserFilter) => {
		return await this.userDataSource.getUser(filterObj);
	};

	getUsers = async () => {
		return await this.userDataSource.getUsers();
	};

	updateUser = async (id: string, user: any) => {
		return await this.userDataSource.updateUser(id, user);
	};

	deleteUser = async (id: string) => {
		return await this.userDataSource.deleteUser(id);
	};
}

export default UserService;
