import { NextFunction, Request, Response } from "express";

import { ERRORS } from "../constants/errors.constant";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api.error";
import {
  ISignInRequestDto,
  ISignUpRequestDto,
} from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError(
          ERRORS.NO_AUTHORIZATION_HEADER.message,
          ERRORS.NO_AUTHORIZATION_HEADER.statusCode,
        );
      }
      const accessToken = header.split("Bearer ")[1];
      if (!accessToken) {
        throw new ApiError(
          ERRORS.INVALID_AUTH_FORMAT.message,
          ERRORS.INVALID_AUTH_FORMAT.statusCode,
        );
      }
      const tokenPayload = tokenService.verifyToken(
        accessToken,
        TokenTypeEnum.ACCESS,
      );

      const pair = await tokenRepository.findByParams({ accessToken });
      if (!pair) {
        throw new ApiError(
          ERRORS.INVALID_TOKEN.message,
          ERRORS.INVALID_TOKEN.statusCode,
        );
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
        throw new ApiError(
          ERRORS.NO_AUTHORIZATION_HEADER.message,
          ERRORS.NO_AUTHORIZATION_HEADER.statusCode,
        );
      }
      const refreshToken = header.split("Bearer ")[1];
      if (!refreshToken) {
        throw new ApiError(
          ERRORS.INVALID_AUTH_FORMAT.message,
          ERRORS.INVALID_AUTH_FORMAT.statusCode,
        );
      }
      const tokenPayload = tokenService.verifyToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );

      const pair = await tokenRepository.findByParams({ refreshToken });
      if (!pair) {
        throw new ApiError(
          ERRORS.INVALID_TOKEN.message,
          ERRORS.INVALID_TOKEN.statusCode,
        );
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
          throw new ApiError(
            ERRORS.ACTION_TOKEN_REQUIRED.message,
            ERRORS.ACTION_TOKEN_REQUIRED.statusCode,
          );
        }

        const tokenEntity = await actionTokenRepository.getByToken(token);
        if (!tokenEntity) {
          throw new ApiError(
            ERRORS.INVALID_TOKEN.message,
            ERRORS.INVALID_TOKEN.statusCode,
          );
        }

        req.res.locals.tokenPayload = tokenService.verifyToken(token, type);
        next();
      } catch (err) {
        next(err);
      }
    };
  }

  // I had to make it a private method in the AuthService...
  public checkEmail(isSafe: boolean = false) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body as ISignUpRequestDto | ISignInRequestDto;
        const user = await userRepository.getByEmail(dto.email);

        // if user forgot he had account before
        if (user && user.isDeleted) {
          req.res.locals.isDeleted = true;
          return next();
        }

        if (user && isSafe) {
          throw new ApiError(
            ERRORS.EMAIL_ALREADY_IN_USE.message,
            ERRORS.EMAIL_ALREADY_IN_USE.statusCode,
          );
        }

        // This logic should ideally be separated, but in this specific case, it's acceptable to keep it.
        if (!user && !isSafe) {
          throw new ApiError(
            ERRORS.INVALID_CREDENTIALS.message,
            ERRORS.INVALID_CREDENTIALS.statusCode,
          );
        }
        next();
      } catch (err) {
        next(err);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
