import {
	UpdateUser,
	UserDocument,
	GetUserFilter,
	CreateUser,
} from "../../utils/types";

export interface UserDataSource {
	createUser(user: CreateUser): Promise<UserDocument>;
	getUser(filterObj: GetUserFilter): Promise<UserDocument | null>;
	getUsers(): Promise<UserDocument[]>;
	updateUser(id: string, user: UpdateUser): Promise<UserDocument | null>;
	deleteUser(id: string): Promise<UserDocument | null>;
}
