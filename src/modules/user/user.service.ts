import { Prisma, User } from "@prisma/client";
import { prisma } from "../../config/db";

const createUser = async (payload: Prisma.UserCreateInput):Promise<User> => {
  console.log({payload}, "payload in service");
//   create a new user
const createdUser = await prisma.user.create({
    data:payload
})
return createdUser;
}

// get all users from database
const getAllUsersDbB = async () => {
  const result = await prisma.user.findMany({
    select:{
      id:true,
      name:true,
      email:true,
      phone:true,
      pictures:true,
      role:true,
      status:true,
      posts:true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });
  return result;
}

// get a single user by id

const getUsersById = async (id: number) => {
 const result = await prisma.user.findUnique({
  where: {
    id
  },
  select:{
    id:true,
    name:true,
    email:true,
    phone:true,
    pictures:true,
    role:true,
    status:true,
    posts:true,

  }
 })
 return result;
}

// delete a user by id
const deleteUserById = async(id: number) => {
 const user = await prisma.user.findUnique({
  where:{
    id
  }
 });

 if(!user){
  throw new Error("User not found");
 }
 const deletedUser = await prisma.user.delete({
  where: {
    id
  }
 });
 return deletedUser
}

// update an user 
const updateUserById = async (id:number, payload: Prisma.UserUpdateInput): Promise<User> => {
// check if user exists
const existingUser = await prisma.user.findUnique({
  where:{id}
})
if(!existingUser){
   throw new Error("User not found");
}
// update user
const updateUser = await prisma.user.update({
 where:{id},
 data: payload
})

return updateUser;
}


export const UserService = {
    createUser,
    getAllUsersDbB,
    getUsersById,
    deleteUserById,
    updateUserById
}