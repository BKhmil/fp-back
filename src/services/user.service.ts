import { ApiError } from "../errors/api.error";
import { ITokenPayload } from "../interfaces/token.interface";
import { IUser, IUserUpdateDto } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async getMe(tokenPayload: ITokenPayload): Promise<IUser> {
    const user = await userRepository.getById(tokenPayload.userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }

  public async updateMe(
    tokenPayload: ITokenPayload,
    dto: IUserUpdateDto,
  ): Promise<IUser> {
    const user = await userRepository.getById(tokenPayload.userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return await userRepository.updateById(user._id, dto);
  }

  public async deleteMe(tokenPayload: ITokenPayload): Promise<void> {
    const user = await userRepository.getById(tokenPayload.userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    await userRepository.softDeleteById(tokenPayload.userId);
    await tokenRepository.deleteAllSignsByUserId(tokenPayload.userId);
    await actionTokenRepository.deleteManyByParams({
      _userId: tokenPayload.userId,
    });
  }

  public async getUserById(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }
}

export const userService = new UserService();
