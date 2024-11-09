import { PrismaClient } from "@prisma/client";

interface User {
  authID: string;
  username: string;
}

const prisma = new PrismaClient();

export const createUser = async ({ authID, username }: User) => {
  //take in the users initial data here
  //check if they already exist
  const userExists = await prisma.user.findUnique({
    where: {
      authId: authID,
    },
  });
  if (userExists) {
    return userExists;
  }
  //create the user in the database

  const user = await prisma.user.create({
    data: {
      authId: authID,
    },
  });
  //return new users data
  return user;
};
