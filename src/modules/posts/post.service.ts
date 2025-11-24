import { Post, Prisma } from "@prisma/client"
import { prisma } from "../../config/db"



const createPost = async (payload: Prisma.PostCreateInput): Promise<Post> => {
 const result = await prisma.post.create({
    data: payload,
    include: {
        author: {
            select:{
                id:true,
                name:true,
                email:true,
                pictures:true,
                role:true,
                isVerified:true
            }
        }
    }
 })
 return result
}

// get all posts 
const getAllPosts = async ({
    page,
    limit
}: {
    page: number,
    limit: number
}): Promise<Post[]> => {
    console.log({page,limit});
    const skip = (page -1) * limit
    const posts = await prisma.post.findMany({
       skip: skip,
       take: limit
    })
    return posts
}
// get a single post by id 
const getPostById = async (postId:number): Promise<Post | null> => {
    const post = await prisma.post.findUnique({
        where: {id: postId},
        include:{
            author:{
                select:{
                    id:true,
                    name: true,
                    email: true,
                    pictures: true,
                    role: true,
                    isVerified: true
                }
            }
        }
    })
    return post
}


// update post 
const updatePost = async (postId: string,payload: Prisma.PostUpdateInput): Promise<Post> => {
    const updated= await prisma.post.update({
        where:{id: Number(postId)},
        data: payload,
        include:{
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    pictures: true,
                    role: true,
                    isVerified: true
                }
            }
        }
    })
    return updated
}

// delete a post by id
const deletePost = async(postId: number):Promise<Post> => {
    const deleted = await prisma.post.delete({
        where: {id: postId},
    })
    return deleted
}

export const PostService = {
    createPost,
     getAllPosts,
    updatePost,
    deletePost,
    getPostById
    }



// 🔥 চাইলে আরও দেই

// আমি চাইলে তোমাকে:

// ✔ Zod validation যোগ করতে
// ✔ Try–catch middleware বানাতে
// ✔ Global error handler দিতে
// ✔ Reusable ApiResponse system বানাতে