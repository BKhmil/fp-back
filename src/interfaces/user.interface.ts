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
}

export type IUserCreateDto = Pick<IUser, "name" | "email" | "age" | "password">;

export type IUserUpdateDto = Pick<IUser, "name" | "age">;

export type ILogin = Pick<IUser, "email" | "password">;

export type IForgotPassword = Pick<IUser, "email">;
export type IForgotPasswordSet = Pick<IUser, "password"> & { token: string };

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};
