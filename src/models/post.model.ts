import { model, Schema } from "mongoose";

import { IPost } from "../interfaces/post.interface";
import { User } from "./user.model";

const postSchema = new Schema(
  {
    text: { type: String, required: true },
    title: { type: String, required: true },
    _userId: { type: Schema.Types.ObjectId, required: true, ref: User },
  },
  { timestamps: true, versionKey: false },
);

export const Post = model<IPost>("posts", postSchema);
