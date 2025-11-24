import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.get("/",
    UserController.getAllUsersDb
)

router.get(
    "/:id",
    UserController.getUsersById
)
router.delete(
    "/:id",
    UserController.deleteUserById
)

router.post('/', 
    UserController.createUser
)
router.put("/update/:id", 
    UserController.updateUser
)

export const UserRouter = router;