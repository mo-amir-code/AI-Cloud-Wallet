import { prisma } from "../../app.js";
import { GetUserByIDOrEmail, UpdateUserType, UserDataType, UserSchemaType } from "../../types/db/schema/index.js";

const createUser = async (data: UserDataType & {
  accessToken?: string | null,
  refreshToken?: string | null
}): Promise<UserSchemaType> => {
  const res = await prisma.user.create({ data });
  return {
    ...res,
    picture: res.picture
  }
};

// Get user by ID
const getUser = async ({ email, id }: GetUserByIDOrEmail): Promise<UserSchemaType | null> => {
  let res;

  if (id) {
    res = await prisma.user.findUnique({
      where: {
        id
      }
    });
  } else {
    res = await prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  return res;
};

// Update user by ID
const updateUser = async (id: string, data: UpdateUserType): Promise<UserSchemaType> => {
  return await prisma.user.update({ where: { id }, data });
};

// Delete user by ID
const deleteUser = async (id: string): Promise<UserSchemaType> => {
  return await prisma.user.delete({ where: { id } });
};

export { createUser, getUser, updateUser, deleteUser };