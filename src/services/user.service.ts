import { ApiError } from "../errors/api.error";
import { ITokenPayload } from "../interfaces/token.interface";
import {
  IUser,
  IUserListQuery,
  IUserListResponseDto,
  IUserResponseDto,
  IUserUpdateRequestDto,
} from "../interfaces/user.interface";
import { userPresenter } from "../presenters/user.presenter";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(query: IUserListQuery): Promise<IUserListResponseDto> {
    const { entities, total } = await userRepository.getList(query);
    return userPresenter.toResponseList(entities, total, query);
  }

  // "Unexpected error" - this error should never occur under normal circumstances since the user ID
  // is extracted from a valid access token. However, it might happen in rare cases, such as:
  //  - The admin deleted the user at the exact moment he made the request.
  //  - A database inconsistency or an unexpected async issue.
  public async getMe(tokenPayload: ITokenPayload): Promise<IUserResponseDto> {
    return userPresenter.toResponse(
      await this.findUserOrThrow(
        tokenPayload.userId,
        "Unexpected error: user not found after authentication",
        500,
      ),
    );
  }

  public async updateMe(
    tokenPayload: ITokenPayload,
    dto: IUserUpdateRequestDto,
  ): Promise<IUserResponseDto> {
    const user = await this.findUserOrThrow(
      tokenPayload.userId,
      "Unexpected error: user not found after authentication",
      500,
    );
    return userPresenter.toResponse(
      await userRepository.updateById(user._id, dto),
    );
  }

  public async deleteMe(tokenPayload: ITokenPayload): Promise<void> {
    await this.findUserOrThrow(
      tokenPayload.userId,
      "Unexpected error: user not found after authentication",
      500,
    );

    await userRepository.softDeleteById(tokenPayload.userId);
    await tokenRepository.deleteAllSignsByUserId(tokenPayload.userId);
    await actionTokenRepository.deleteManyByParams({
      _userId: tokenPayload.userId,
    });
  }

  public async getUserById(userId: string): Promise<IUserResponseDto> {
    return userPresenter.toResponse(
      await this.findUserOrThrow(userId, "User not found", 404),
    );
  }

  private async findUserOrThrow(
    userId: string,
    errMessage: string,
    errCode: number,
  ): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user || user.isDeleted) {
      throw new ApiError(errMessage, errCode);
    }
    return user;
  }
}

export const userService = new UserService();
