import { model, Schema } from "mongoose";

import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

export const User = model<IUser>("users", userSchema);
