import { NextFunction, Request, Response } from "express";

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

        const tokenEntity = await actionTokenRepository.getByToken(token);
        if (!tokenEntity) {
          throw new ApiError("Token is not valid", 401);
        }

        req.res.locals.tokenPayload = tokenService.verifyToken(token, type);
        next();
      } catch (err) {
        next(err);
      }
    };
  }

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
}

export const authMiddleware = new AuthMiddleware();
