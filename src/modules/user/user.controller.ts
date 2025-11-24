import { Request, Response } from "express";
import { UserService } from "./user.service";

// create a new user
const createUser = async (req: Request, res:Response) => {
  try {
   const result = await UserService.createUser(req.body);
    res.status(201).send(result);
  } catch (error) {
     res.status(500).send(error);
  }
}

// get all users from database
const getAllUsersDb = async (req: Request, res:Response) => {
  try {
   const result = await UserService.getAllUsersDbB();
   res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

// get  users by id from database
const getUsersById = async (req: Request, res:Response) => {
  try {
   const result = await UserService.getUsersById(Number(req.params.id));
   res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

// delete a user by id from database 
const deleteUserById = async (req: Request,res:Response) => {
 try {
   const id = Number(req.params.id);
  const result = await UserService.deleteUserById(id);
  res.status(200).send(result);
 } catch (error) {
  res.status(500).send(error);
 }
}

// update a user by id from database
const updateUser = async (req: Request, res: Response) => {
  try {
    const id  = Number(req.params.id);
    const payload = req.body;
    const result = await UserService.updateUserById(id,payload);
    res.status(201).json({
      success: true,
      message: "User updated successfully",
      data: result
    })
  } catch (error: any) {
     res.status(400).json({ success: false, message: error.message });
  }
}

export const UserController = {
    createUser,
    getAllUsersDb,
    getUsersById,
    deleteUserById,
    updateUser
}