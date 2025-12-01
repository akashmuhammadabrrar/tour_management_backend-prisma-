import express from 'express';
import { PostController } from './post.controller';

const router = express.Router();

router.post("/",
    PostController.creatPost
)
router.get("/",
    PostController.getPosts
)
router.get("/stats",
    PostController.getBlogStats
)
router.get("/:id", 
    PostController.getPost
)
router.put("/:id",
    PostController.updatePost
)
router.delete("/:id", 
    PostController.deletePost
)

export const postRouter = router;