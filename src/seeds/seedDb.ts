import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

import { envConfig } from "../configs/env.config";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";
import { passwordService } from "../services/password.service";

const seedDatabase = async () => {
  await mongoose.connect(envConfig.MONGO_URI, {});
  await User.deleteMany();
  await Post.deleteMany();

  const hashedPassword = await passwordService.hashPassword("fffff11???");

  const users = [];
  for (let i = 0; i < 70; i++) {
    const isDeleted = i < 20;
    const isVerified = !isDeleted && i >= 40;

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

    users.push(
      new User({
        name: isDeleted
          ? `DeletedUser${i}`
          : isVerified
            ? `VerifiedUser${i}`
            : `UnverifiedUser${i}`,
        email,
        age: faker.number.int({ min: 18, max: 60 }),
        password: hashedPassword,
        isDeleted,
        isVerified,
        deletedAt: isDeleted ? new Date() : null,
      }),
    );
  }

  await User.insertMany(users);

  const verifiedUsers = await User.find({ isVerified: true, isDeleted: false });
  const posts = [];

  verifiedUsers.forEach((user) => {
    const numPosts = faker.number.int({ min: 1, max: 20 });
    for (let j = 0; j < numPosts; j++) {
      posts.push(
        new Post({
          title: faker.lorem.sentence(5),
          text: faker.lorem.paragraph(),
          _userId: user._id,
        }),
      );
    }
  });

  await Post.insertMany(posts);
  console.log("Database seeded successfully");
  await mongoose.disconnect();
};

seedDatabase().catch((err) => console.error(err));
