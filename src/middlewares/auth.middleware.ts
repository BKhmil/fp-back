import { NextFunction, Request, Response } from "express";

import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api.error";
import { ITokenPayload } from "../interfaces/token.interface";
import {
  IChangePasswordDto,
  IForgotPasswordSetDto,
  ISignInDto,
  ISignUpDto,
} from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { oldPasswordRepository } from "../repositories/old-password.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "../services/password.service";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async verifyTokenSetTokenPayload(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {}

  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError("No token provided", 401);
      }
      const accessToken = header.split("Bearer ")[1];
      if (!accessToken) {
        throw new ApiError("No token provided", 401);
      }
      const tokenPayload = tokenService.verifyToken(
        accessToken,
        TokenTypeEnum.ACCESS,
      );

      const pair = await tokenRepository.findByParams({ accessToken });
      if (!pair) {
        throw new ApiError("Invalid token", 401);
      }
      req.res.locals.tokenPayload = tokenPayload;
      req.res.locals.accessToken = accessToken;
      next();
    } catch (err) {
      next(err);
    }
  }

  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError("No token provided", 401);
      }
      const refreshToken = header.split("Bearer ")[1];
      if (!refreshToken) {
        throw new ApiError("No token provided", 401);
      }
      const tokenPayload = tokenService.verifyToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );

      const pair = await tokenRepository.findByParams({ refreshToken });
      if (!pair) {
        throw new ApiError("Invalid token", 401);
      }
      req.res.locals.tokenPayload = tokenPayload;
      req.res.locals.refreshToken = refreshToken;
      next();
    } catch (err) {
      next(err);
    }
  }

  public checkActionToken(type: ActionTokenTypeEnum) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.body.token as string;
        if (!token) {
          throw new ApiError("Token is not provided", 401);
        }
        const payload = tokenService.verifyToken(token, type);

        const tokenEntity = await actionTokenRepository.getByToken(token);
        if (!tokenEntity) {
          throw new ApiError("Token is not valid", 401);
        }
        req.res.locals.tokenPayload = payload;
        next();
      } catch (err) {
        next(err);
      }
    };
  }

  public checkEmail(isSafe: boolean = false) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as ISignUpDto | ISignInDto;
        const user = await userRepository.getByEmail(dto.email);
        if (user && isSafe) {
          throw new ApiError("Email is already in use", 409);
        }

        // This logic should ideally be separated, but in this specific case, it's acceptable to keep it.
        if (!user && !isSafe) {
          throw new ApiError("Incorrect email or password", 401);
        }
        next();
      } catch (err) {
        next(err);
      }
    };
  }

  public checkNewPasswordIsUnique(isForChange: boolean = false) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        let dto: IChangePasswordDto | IForgotPasswordSetDto;
        let isNewPasswordEqualsCurrent: boolean;
        let newPassword: string;

        const { userId } = req.res.locals.tokenPayload as ITokenPayload;
        const user = await userRepository.getById(userId);

        // there's the logic
        // I have
        //
        // FORGOT CASE:
        // - NEW_PASSWORD must not be equal to CURRENT_PASSWORD stored in DB                #case1
        // - NEW_PASSWORD must not match any password from the POOL_OF_OLD_PASSWORDS        #case2
        //
        // CHANGE CASE:
        // - NEW_PASSWORD must not be equal to CURRENT_PASSWORD stored in DB                #case1
        // - NEW_PASSWORD must not match any password from the POOL_OF_OLD_PASSWORDS        #case2
        // - OLD_PASSWORD (sent by user) must match CURRENT_PASSWORD stored in DB           #case3

        if (isForChange) {
          dto = req.body as IChangePasswordDto;
          newPassword = dto.newPassword;

          // #case3
          const isOldPasswordMatchesCurrent =
            await passwordService.comparePassword(
              dto.oldPassword,
              user.password,
            );

          if (!isOldPasswordMatchesCurrent) {
            throw new ApiError("Incorrect password", 401);
          }

          // #case1
          isNewPasswordEqualsCurrent = await passwordService.comparePassword(
            newPassword,
            dto.oldPassword,
          );
        } else {
          dto = req.body as IForgotPasswordSetDto;
          newPassword = dto.password;

          // case#1
          isNewPasswordEqualsCurrent = await passwordService.comparePassword(
            newPassword,
            user.password,
          );
        }

        if (isNewPasswordEqualsCurrent) {
          throw new ApiError("You can not set the old password", 401);
        }

        const docs = await oldPasswordRepository.getMany(userId);

        // #case2
        for (const doc of docs) {
          const isSame = await passwordService.comparePassword(
            newPassword,
            doc.password,
          );
          if (isSame) {
            throw new ApiError("You can not set the old password", 401);
          }
        }

        res.locals.user = user;
        next();
      } catch (err) {
        next(err);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
