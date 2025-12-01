import { Post, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

// Create a post
const createPost = async (payload: Prisma.PostCreateInput): Promise<Post> => {
  const result = await prisma.post.create({
    data: payload,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          pictures: true,
          role: true,
          isVerified: true,
        },
      },
    },
  });
  return result;
};

// Get all posts with pagination, search, featured, tags
const getAllPosts = async ({
  page = 1,
  limit = 10,
  search,
  isFeatured,
  tags,
}: {
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
  tags?: string[];
}): Promise<{
  data: Post[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> => {
  const skip = (page - 1) * limit;

  const whereValue: any = {
    AND: [
      search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
      typeof isFeatured === "boolean" && { isFeatured },
      tags && tags.length > 0 && { tags: { hasEvery: tags } },
    ].filter(Boolean),
  };

  const posts = await prisma.post.findMany({
    skip,
    take: limit,
    where: whereValue,
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.post.count({ where: whereValue });

  return {
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single post by ID and increment viewCount
const getPostById = async (postId: number): Promise<Post | null> => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Increment viewCount
      const updated = await tx.post.update({
        where: { id: postId },
        data: { viewCount: { increment: 1 } },
      });

      // Fetch post with author
      const postData = await tx.post.findUnique({
        where: { id: postId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              pictures: true,
              role: true,
              isVerified: true,
            },
          },
        },
      });

      return postData;
    });

    return result;
  } catch (err) {
    console.error("Error incrementing viewCount:", err);
    return null;
  }
};

// Update post
const updatePost = async (postId: string, payload: Prisma.PostUpdateInput): Promise<Post> => {
  const updated = await prisma.post.update({
    where: { id: Number(postId) },
    data: payload,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          pictures: true,
          role: true,
          isVerified: true,
        },
      },
    },
  });
  return updated;
};

// Delete post
const deletePost = async (postId: number): Promise<Post> => {
  const deleted = await prisma.post.delete({ where: { id: postId } });
  return deleted;
};

// Get blog stats
const getBlogStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const aggregate = await tx.post.aggregate({
      _count: true,
      _sum: { viewCount: true },
      _avg: { viewCount: true },
      _max: { viewCount: true },
      _min: { viewCount: true },
    });

    const featuredCount = await tx.post.count({ where: { isFeatured: true } });
    const topFeatured = await tx.post.findFirst({ where: { isFeatured: true }, orderBy: { viewCount: "desc" } });
const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() -7)
const lastWeekPostCount = await tx.post.count({
    where: {
        createdAt: {
            gte: lastWeek
        }
    }
})
    return {
      stats: {
        totalPosts: aggregate._count ?? 0,
        totalViews: aggregate._sum.viewCount ?? 0,
        avgViews: aggregate._avg.viewCount ?? 0,
        minViews: aggregate._min.viewCount ?? 0,
        maxViews: aggregate._max.viewCount ?? 0,
      },
      featured: {
        count: featuredCount,
        topPost: topFeatured,
      },
      lastWeekPostCount
    };
  });
};

export const PostService = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getBlogStats,
};




// 🔥 চাইলে আরও দেই

// আমি চাইলে তোমাকে:

// ✔ Zod validation যোগ করতে
// ✔ Try–catch middleware বানাতে
// ✔ Global error handler দিতে
// ✔ Reusable ApiResponse system বানাতে
