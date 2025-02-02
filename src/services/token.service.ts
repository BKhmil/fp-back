import * as jwt from "jsonwebtoken";
import ms from "ms";

import { envConfig } from "../configs/env.config";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api.error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";

class TokenService {
  public generateTokens(payload: ITokenPayload): ITokenPair {
    const accessToken = jwt.sign(payload, envConfig.JWT_ACCESS_SECRET, {
      expiresIn: envConfig.JWT_ACCESS_EXPIRATION as ms.StringValue,
    });
    //               For some reason, it doesn't work without explicitly casting to <ms.StringValue>,
    //               whereas it used to work before
    const refreshToken = jwt.sign(payload, envConfig.JWT_REFRESH_SECRET, {
      expiresIn: envConfig.JWT_REFRESH_EXPIRATION as ms.StringValue,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  public generateActionTokens(
    payload: ITokenPayload,
    type: ActionTokenTypeEnum,
  ): string {
    let secret: string;
    let expiresIn: string;

    switch (type) {
      case ActionTokenTypeEnum.FORGOT_PASSWORD:
        secret = envConfig.ACTION_FORGOT_PASSWORD_SECRET;
        expiresIn = envConfig.ACTION_FORGOT_PASSWORD_EXPIRATION;
        break;
      case ActionTokenTypeEnum.VERIFY_EMAIL:
        secret = envConfig.ACTION_VERIFY_EMAIL_SECRET;
        expiresIn = envConfig.ACTION_VERIFY_EMAIL_EXPIRATION;
        break;
      default:
        throw new ApiError("Invalid action token type", 500);
    }
    return jwt.sign(payload, secret, {
      expiresIn: expiresIn as ms.StringValue,
    });
  }

  public verifyToken(
    token: string,
    type: TokenTypeEnum | ActionTokenTypeEnum,
  ): ITokenPayload {
    try {
      let secret: string;

      switch (type) {
        case TokenTypeEnum.ACCESS:
          secret = envConfig.JWT_ACCESS_SECRET;
          break;
        case TokenTypeEnum.REFRESH:
          secret = envConfig.JWT_REFRESH_SECRET;
          break;
        case ActionTokenTypeEnum.FORGOT_PASSWORD:
          secret = envConfig.ACTION_FORGOT_PASSWORD_SECRET;
          break;
        case ActionTokenTypeEnum.VERIFY_EMAIL:
          secret = envConfig.ACTION_VERIFY_EMAIL_SECRET;
          break;
        default:
          throw new ApiError("Invalid token type", 401);
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      console.error(e.message);
      throw new ApiError("Invalid token", 401);
    }
  }
}

export const tokenService = new TokenService();
