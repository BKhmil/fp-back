import {
  IUser,
  IUserListQuery,
  IUserListResponseDto,
  IUserResponseDto,
  IUserShortResponseDto,
} from "../interfaces/user.interface";

class UserPresenter {
  public toResponse(entity: IUser): IUserResponseDto {
    return {
      _id: entity._id,
      name: entity.name,
      email: entity.email,
      age: entity.age,
      isVerified: entity.isVerified,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public toShortResponse(entity: IUser): IUserShortResponseDto {
    return {
      _id: entity._id,
      age: entity.age,
      name: entity.name,
      createdAt: entity.createdAt,
    };
  }

  public toResponseList(
    entities: IUser[],
    total: number,
    query: IUserListQuery,
  ): IUserListResponseDto {
    return {
      data: entities.map(this.toShortResponse),
      total,
      ...query,
    };
  }
}

export const userPresenter = new UserPresenter();
