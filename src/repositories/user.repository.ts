import { FilterQuery } from "mongoose";

import {
  ISignUpRequestDto,
  IUser,
  IUserListQuery,
} from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getList(
    query: IUserListQuery,
  ): Promise<{ entities: IUser[]; total: number }> {
    const filterObj: FilterQuery<IUser> = { isDeleted: false };

    if (query.name) {
      filterObj.name = { $regex: query.name, $options: "i" };
    }

    if (query.age) {
      filterObj.age = query.age;
    } else {
      if (query.minAge && query.maxAge) {
        filterObj.age = { $gte: query.minAge, $lte: query.maxAge };
      } else if (query.minAge) {
        filterObj.age = { $gte: query.minAge };
      } else if (query.maxAge) {
        filterObj.age = { $lte: query.maxAge };
      }
    }

    const skip = query.limit * (query.page - 1);

    const sortObj = { [query.orderBy]: query.order };

    const [entities, total] = await Promise.all([
      User.find(filterObj).sort(sortObj).limit(query.limit).skip(skip),
      User.countDocuments(filterObj),
    ]);
    return { entities, total };
  }

  public async create(dto: ISignUpRequestDto): Promise<IUser> {
    return await User.create(dto);
  }

  public async getById(userId: string): Promise<IUser> {
    return await User.findById(userId);
  }

  public async getByEmail(email: string): Promise<IUser> {
    return await User.findOne({ email });
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, { new: true });
  }

  public async softDeleteById(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }
}

export const userRepository = new UserRepository();
