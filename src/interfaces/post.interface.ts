import { OrderEnum } from "../enums/order.enum";
import { PostListOrderEnum } from "../enums/post-list-order.enum";

export interface IPost {
  _id: string;
  title: string;
  text: string;
  _userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IPostCreateRequestDto = Pick<IPost, "title" | "text">;

export type IPostUpdateRequestDto = Pick<IPost, "title" | "text">;

export type IPostResponseDto = Pick<
  IPost,
  "_id" | "title" | "text" | "createdAt" | "updatedAt"
>;

export type IPostListQuery = {
  page: number;
  limit: number;
  title?: string;
  order: OrderEnum;
  orderBy: PostListOrderEnum;
};

export interface IPostListResponseDto extends IPostListQuery {
  data: IPostResponseDto[];
  userId: string;
  total: number;
}
