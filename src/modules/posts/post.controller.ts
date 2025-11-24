import { Request,Response } from "express";
import { PostService } from "./post.service";

// create post controller
const creatPost = async (req: Request, res:Response) => {
    try {
        const result = await PostService.createPost(req.body)
        res.status(201).send(result)
    } catch (error) {
        res.status(500).send(error)
    }
}

// get all posts controller
const getPosts = async (req: Request,res: Response) => {
    try {
        // pagination (offset)
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const posts = await PostService.getAllPosts({page,limit})
        res.status(201).send(posts)
    } catch (error) {
        res.status(500).send(error)
    }
}

//  get a post by id
const getPost = async (req:Request, res:Response) => {
    try {
        const  postId = Number(req.params.id)
        const post = await PostService.getPostById(postId)
        if(!post){
            return res.status(403).json({
                success: false,
                message: "Post data is not found"
            })
        }
        res.status(201).json({
            success: true,
            data: post
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get post",
            error
        })
    }
}

// update post controller
const updatePost = async (req:Request, res: Response) => {
    try {
        const postId = req.params.id
        const payload = req.body
        const updatedPost = await PostService.updatePost(postId,payload)
        res.status(200).send(updatedPost)
    } catch (error) {
       
        res.status(500).send(error)
    }
}

// delete post controller 
const deletePost = async (req:Request, res:Response) => {
    try {
        const postId = Number(req.params.id)
        const deleted = await PostService.deletePost(postId)
        res.status(201).json({
            success: true,
            message: "Post deleted successfully",
            data: deleted
        })
    } catch (error) {
         res.status(500).json({
            success: false,
            message: "Failed to delete post",
            error: error
        })
    }
}

export const PostController = {
    creatPost,
    getPosts,
    updatePost,
    deletePost,
    getPost
}