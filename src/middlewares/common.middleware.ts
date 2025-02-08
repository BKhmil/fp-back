import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ERRORS } from "../constants/errors.constant";
import { ApiError } from "../errors/api.error";

class CommonMiddleware {
  public isIdValid(key: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params[key];
        if (!isObjectIdOrHexString(id)) {
          throw new ApiError(
            ERRORS.INVALID_ID.message,
            ERRORS.INVALID_ID.statusCode,
          );
        }
        next();
      } catch (err) {
        next(err);
      }
    };
  }

  public isBodyEmpty(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body;

      // https://expressjs.com/en/5x/api.html#req.body => "By default, it is undefined"
      // however, middlewares like express.json() assign an empty object to req.body,
      // so I have to check it with Object.keys()
      if (!Object.keys(dto).length) {
        throw new ApiError(
          ERRORS.EMPTY_BODY.message,
          ERRORS.EMPTY_BODY.statusCode,
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  }

  public validateBody(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = await validator.validateAsync(req.body);
        next();
      } catch (err) {
        if (err.isJoi) {
          next(
            new ApiError(
              err.details[0].message,
              ERRORS.VALIDATION_ERROR.statusCode,
            ),
          );
        } else {
          next(err);
        }
      }
    };
  }

  public validateQuery(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.query = await validator.validateAsync(req.query);
        next();
      } catch (err) {
        if (err.isJoi) {
          next(
            new ApiError(
              err.details[0].message,
              ERRORS.VALIDATION_ERROR.statusCode,
            ),
          );
        } else {
          next(err);
        }
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
