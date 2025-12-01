import { Prisma } from "@prisma/client";
import { prisma } from "../../config/db"

const loginWithEmailAndPassword = async({email,password}: {email: string, password: string}) => {
    
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    });
     if(!user){
        throw new Error("user not found")
     }
     if(password === user.password){
        return user
     }
     else{
        throw new Error("password is not correct!!!")
     }
    
}


// login with google
const authWithGoogle = async(data: Prisma.UserCreateInput) => {

    let user = await prisma.user.findUnique({
        where: {
            email: data.email,
            password: data.password
        }
    })
    if(!user){
        user= await prisma.user.create({
            data
        })
    }
    return user
}

export const AuthService = {loginWithEmailAndPassword, authWithGoogle}