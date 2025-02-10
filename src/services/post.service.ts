import { ERRORS } from "../constants/errors.constant";
import { ApiError } from "../errors/api.error";
import {
  IPost,
  IPostCreateRequestDto,
  IPostListQuery,
  IPostListResponseDto,
  IPostUpdateRequestDto,
} from "../interfaces/post.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { postPresenter } from "../presenters/post.presenter";
import { postRepository } from "../repositories/post.repository";

class PostService {
  public async getList(
    userId: string,
    query: IPostListQuery,
  ): Promise<IPostListResponseDto> {
    const { entities, total } = await postRepository.getList(query, userId);
    return postPresenter.toResponseList(entities, total, query, userId);
  }

  public async create(
    tokenPayload: ITokenPayload,
    dto: IPostCreateRequestDto,
  ): Promise<IPost> {
    return await postRepository.create(dto, tokenPayload.userId);
  }

  public async update(
    tokenPayload: ITokenPayload,
    postId: string,
    dto: IPostUpdateRequestDto,
  ): Promise<IPost> {
    const post = await this.postExistsOrThrow(postId);

    this.checkHasAccessOrThrow(tokenPayload.userId, post._userId);

    return await postRepository.update(postId, dto);
  }

  public async delete(
    tokenPayload: ITokenPayload,
    postId: string,
  ): Promise<void> {
    const post = await this.postExistsOrThrow(postId);

    this.checkHasAccessOrThrow(tokenPayload.userId, post._userId);

    await postRepository.deleteOneByParams({ _id: postId });
  }

  private async postExistsOrThrow(postId: string): Promise<IPost> {
    const post = await postRepository.getById(postId);
    if (!post) {
      throw new ApiError(
        ERRORS.POST_NOT_FOUND.message,
        ERRORS.POST_NOT_FOUND.statusCode,
      );
    }

    return post;
  }

  private checkHasAccessOrThrow(userId: string, postUserId: string) {
    if (userId !== postUserId.toString()) {
      throw new ApiError(
        ERRORS.FORBIDDEN_POST_ACCESS.message,
        ERRORS.FORBIDDEN_POST_ACCESS.statusCode,
      );
    }
  }
}

export const postService = new PostService();
