import { OrderEnum } from "../enums/order.enum";
import { UserListOrderEnum } from "../enums/user-list-order.enum";

export interface IUser {
  _id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  isDeleted: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type ISignUpDto = Pick<IUser, "name" | "email" | "age" | "password">;

export type IUserUpdateDto = Pick<IUser, "name" | "age">;

export type ISignInDto = Pick<IUser, "email" | "password">;

export type IForgotPasswordDto = Pick<IUser, "email">;
export type IForgotPasswordSetDto = Pick<IUser, "password"> & { token: string };

export type IAccountRestoreDto = Pick<IUser, "email">;
export type IAccountRestoreSetDto = Pick<IUser, "password"> & { token: string };

export type IChangePasswordDto = {
  oldPassword: string;
  newPassword: string;
};

export type IUserListQuery = {
  page: number;
  limit: number;
  name?: string;
  age?: number;
  minAge?: number;
  maxAge?: number;
  order: OrderEnum;
  orderBy: UserListOrderEnum;
};

export type IUserResponse = Pick<
  IUser,
  "_id" | "name" | "email" | "age" | "isVerified" | "createdAt" | "updatedAt"
>;

export type IUserShortResponse = Pick<
  IUser,
  "_id" | "name" | "createdAt" | "age"
>;

export interface IUserListResponse extends IUserListQuery {
  data: IUserShortResponse[];
  total: number;
}
