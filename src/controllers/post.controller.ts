import { NextFunction, Request, Response } from "express";

import {
  IPostCreateRequestDto,
  IPostListQuery,
  IPostUpdateRequestDto,
} from "../interfaces/post.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { postService } from "../services/post.service";

class PostController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as IPostListQuery;
      const userId = req.params.userId;

      const result = await postService.getList(userId, query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      const dto = req.body as IPostCreateRequestDto;
      const result = await postService.create(tokenPayload, dto);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.params.postId as string;
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      const dto = req.body as IPostUpdateRequestDto;
      const result = await postService.update(tokenPayload, postId, dto);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.params.postId as string;
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      const result = await postService.delete(tokenPayload, postId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const postController = new PostController();
