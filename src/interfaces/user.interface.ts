import { OrderEnum } from "../enums/order.enum";
import { UserListOrderEnum } from "../enums/user-list-order.enum";
import { ITokenPair } from "./token.interface";

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

export type IUserResponseDto = Pick<
  IUser,
  "_id" | "name" | "email" | "age" | "isVerified" | "createdAt" | "updatedAt"
>;

export type IUserShortResponseDto = Pick<
  IUser,
  "_id" | "name" | "createdAt" | "age"
>;

export interface IUserListResponseDto extends IUserListQuery {
  data: IUserShortResponseDto[];
  total: number;
}

// ------------- AUTH -------------
// region Request
export type ISignUpRequestDto = Pick<
  IUser,
  "name" | "email" | "age" | "password"
>;

export type IUserUpdateRequestDto = Pick<IUser, "name" | "age">;

export type ISignInRequestDto = Pick<IUser, "email" | "password">;

export type IForgotPasswordRequestDto = Pick<IUser, "email">;
export type IForgotPasswordSetRequestDto = Pick<IUser, "password"> & {
  token: string;
};

export type IAccountRestoreRequestDto = Pick<IUser, "email">;
export type IAccountRestoreSetRequestDto = Pick<IUser, "password"> & {
  token: string;
};

export type IChangePasswordRequestDto = {
  oldPassword: string;
  newPassword: string;
};
// endregion Request

// region Response
export type ISignInResponseDto = {
  user: IUserResponseDto;
  tokens: ITokenPair;
};

export type ISignUpRestoreResponseDto = { canRestore: true };
// endregion Response
