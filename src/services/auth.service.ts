import { envConfig } from "../configs/env.config";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api.error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import {
  IChangePasswordDto,
  IForgotPasswordDto,
  IForgotPasswordSetDto,
  ISignInDto,
  ISignUpDto,
  IUser,
} from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { oldPasswordRepository } from "../repositories/old-password.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    dto: ISignUpDto,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    const password = await passwordService.hashPassword(dto.password);
    const user = await userRepository.create({ ...dto, password });

    const tokens = tokenService.generateTokens({
      userId: user._id,
      name: user.name,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id });

    const token = tokenService.generateActionToken(
      { userId: user._id, name: user.name },
      ActionTokenTypeEnum.VERIFY_EMAIL,
    );
    await actionTokenRepository.create({
      token,
      type: ActionTokenTypeEnum.VERIFY_EMAIL,
      _userId: user._id,
    });

    try {
      await emailService.sendEmail(EmailTypeEnum.WELCOME, user.email, {
        name: user.name,
        frontUrl: envConfig.APP_FRONT_URL,
        actionToken: token,
      });
    } catch (err) {
      throw new ApiError(err.message, 500);
    }

    return { user, tokens };
  }

  public async signIn(
    dto: ISignInDto,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    const user = await userRepository.getByEmail(dto.email);

    const isPasswordCorrect = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiError("Incorrect email or password", 401);
    }
    const tokens = tokenService.generateTokens({
      userId: user._id,
      name: user.name,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id });
    return { user, tokens };
  }

  public async refresh(
    tokenPayload: ITokenPayload,
    refreshToken: string,
  ): Promise<ITokenPair> {
    await tokenRepository.deleteOneByParams({ refreshToken });
    const tokens = tokenService.generateTokens({
      userId: tokenPayload.userId,
      name: tokenPayload.name,
    });
    await tokenRepository.create({ ...tokens, _userId: tokenPayload.userId });
    return tokens;
  }

  public async logout(
    accessToken: string,
    payload: ITokenPayload,
  ): Promise<void> {
    await tokenRepository.deleteSignByAccessToken(accessToken);
    const user = await userRepository.getById(payload.userId);
    await emailService.sendEmail(EmailTypeEnum.LOGOUT, user.email, {
      name: user.name,
      frontUrl: envConfig.APP_FRONT_URL,
    });
  }

  public async logoutAll(payload: ITokenPayload): Promise<void> {
    await tokenRepository.deleteAllSignsByUserId(payload.userId);
    const user = await userRepository.getById(payload.userId);
    await emailService.sendEmail(EmailTypeEnum.LOGOUT, user.email, {
      name: user.name,
      frontUrl: envConfig.APP_FRONT_URL,
    });
  }

  public async forgotPassword(dto: IForgotPasswordDto): Promise<void> {
    const user = await userRepository.getByEmail(dto.email);
    if (!user) return;

    const token = tokenService.generateActionToken(
      { userId: user._id, name: user.name },
      ActionTokenTypeEnum.FORGOT_PASSWORD,
    );
    await actionTokenRepository.create({
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
      _userId: user._id,
      token,
    });
    await emailService.sendEmail(EmailTypeEnum.FORGOT_PASSWORD, dto.email, {
      frontUrl: envConfig.APP_FRONT_URL,
      actionToken: token,
    });
  }

  public async forgotPasswordSet(dto: IForgotPasswordSetDto): Promise<void> {
    const payload = tokenService.verifyToken(
      dto.token,
      ActionTokenTypeEnum.FORGOT_PASSWORD,
    );
    const entity = await actionTokenRepository.findOneByParams({
      token: dto.token,
    });
    if (!entity) {
      throw new ApiError("Invalid token", 401);
    }

    const user = await userRepository.getById(payload.userId);

    // await this.isNewPasswordNewOrThrow(
    //   dto.password,
    //   user.password,
    //   payload.userId,
    // );

    await oldPasswordRepository.create({
      password: user.password,
      _userId: payload.userId,
    });

    const password = await passwordService.hashPassword(dto.password);
    await userRepository.updateById(payload.userId, { password });

    await actionTokenRepository.deleteOneByParams({ token: dto.token });
    await tokenRepository.deleteAllByParams({ _userId: payload.userId });
  }

  public async verify(payload: ITokenPayload): Promise<void> {
    await userRepository.updateById(payload.userId, { isVerified: true });
    await actionTokenRepository.deleteManyByParams({
      _userId: payload.userId,
      type: ActionTokenTypeEnum.VERIFY_EMAIL,
    });
  }

  public async changePassword(
    dto: IChangePasswordDto,
    tokenPayload: ITokenPayload,
  ): Promise<void> {
    const user = await userRepository.getById(tokenPayload.userId);
    const isPasswordCorrect = await passwordService.comparePassword(
      dto.oldPassword,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiError("Incorrect password", 401);
    }

    // await this.isNewPasswordNewOrThrow(
    //   dto.newPassword,
    //   user.password,
    //   tokenPayload.userId,
    // );

    await oldPasswordRepository.create({
      password: user.password,
      _userId: tokenPayload.userId,
    });

    const password = await passwordService.hashPassword(dto.newPassword);
    await userRepository.updateById(tokenPayload.userId, { password });
    await tokenRepository.deleteAllByParams({ _userId: tokenPayload.userId });
  }

  // private async isNewPasswordNewOrThrow(
  //   newPassword: string,
  //   oldHashedPassword: string,
  //   userId: string,
  // ): Promise<void> {
  //   const isNewPasswordSameAsACurrent = await passwordService.comparePassword(
  //     newPassword,
  //     oldHashedPassword,
  //   );
  //   if (isNewPasswordSameAsACurrent) {
  //     throw new ApiError("You can not set the old password", 401);
  //   }
  //
  //   const docs = await oldPasswordRepository.getMany(userId);
  //   for (const doc of docs) {
  //     const isSame = await passwordService.comparePassword(
  //       newPassword,
  //       doc.password,
  //     );
  //     if (isSame) {
  //       throw new ApiError("You can not set the old password", 401);
  //     }
  //   }
  // }
}

export const authService = new AuthService();
