import {
  IPost,
  IPostListQuery,
  IPostListResponseDto,
  IPostResponseDto,
} from "../interfaces/post.interface";

class PostPresenter {
  public toResponse(entity: IPost): IPostResponseDto {
    return {
      _id: entity._id,
      title: entity.title,
      text: entity.text,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public toResponseList(
    entities: IPost[],
    total: number,
    query: IPostListQuery,
    userId: string,
  ): IPostListResponseDto {
    return {
      data: userId ? entities.map(this.toResponse) : [],
      userId,
      total,
      ...query,
    };
  }
}

export const postPresenter = new PostPresenter();
