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

export type ISignUpDto = Pick<IUser, "name" | "email" | "age" | "password">;

export type IUserUpdateDto = Pick<IUser, "name" | "age">;

export type ISignInDto = Pick<IUser, "email" | "password">;

export type IForgotPasswordDto = Pick<IUser, "email">;
export type IForgotPasswordSetDto = Pick<IUser, "password"> & { token: string };

export type IChangePasswordDto = {
  oldPassword: string;
  newPassword: string;
};
