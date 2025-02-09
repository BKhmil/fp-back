import { FilterQuery } from "mongoose";

import {
  IPost,
  IPostCreateRequestDto,
  IPostListQuery,
  IPostUpdateRequestDto,
} from "../interfaces/post.interface";
import { Post } from "../models/post.model";

class PostRepository {
  public async getList(
    query: IPostListQuery,
    userId: string,
  ): Promise<{ entities: IPost[]; total: number }> {
    const filterObj: FilterQuery<IPost> = { _userId: userId };

    if (query.title) {
      filterObj.title = { $regex: query.title, $options: "i" };
    }

    const skip = query.limit * (query.page - 1);

    const sortObj = { [query.orderBy]: query.order };

    const [entities, total] = await Promise.all([
      Post.find(filterObj).sort(sortObj).limit(query.limit).skip(skip),
      Post.countDocuments(filterObj),
    ]);
    return { entities, total };
  }

  public async getById(postId: string): Promise<IPost | null> {
    return await Post.findById(postId);
  }

  public async create(
    dto: IPostCreateRequestDto,
    userId: string,
  ): Promise<IPost> {
    return await Post.create({ ...dto, _userId: userId });
  }

  public async update(
    postId: string,
    dto: Partial<IPostUpdateRequestDto>,
  ): Promise<IPost> {
    return await Post.findByIdAndUpdate(postId, dto, { new: true });
  }

  public async deleteOneByParams(params: Partial<IPost>) {
    await Post.deleteOne(params);
  }
}

export const postRepository = new PostRepository();
