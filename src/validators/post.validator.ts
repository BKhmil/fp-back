import joi from "joi";

import { OrderEnum } from "../enums/order.enum";
import { PostListOrderEnum } from "../enums/post-list-order.enum";

export class PostValidator {
  private static title = joi.string().min(1).max(50).trim();
  private static text = joi.string().min(1).max(2000).trim();

  public static create = joi.object({
    title: this.title.required(),
    text: this.text.required(),
  });

  public static update = joi.object({
    title: this.title.optional(),
    text: this.text.optional(),
  });

  public static getListQuery = joi.object({
    limit: joi.number().min(1).max(100).default(10),
    page: joi.number().min(1).default(1),
    title: this.title.optional(),
    order: joi
      .string()
      .valid(...Object.values(OrderEnum))
      .default(OrderEnum.ASC),
    orderBy: joi
      .string()
      .valid(...Object.values(PostListOrderEnum))
      .default(PostListOrderEnum.CREATED_AT),
  });
}
