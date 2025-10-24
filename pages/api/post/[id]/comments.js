import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import likesModel from "@/models/commentLikes";
import commentsModel from "@/models/comments";
import usersModel from "@/models/users";
import { isValidObjectId } from "mongoose";

const handler = async (req, res) => {
  if (req.method !== "GET") return res.status(405).end();
  await connectToDB();
  
  try {
    const { id } = req.query;
    
    // Validate post ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        message: "Invalid post ID!",
        comments: [],
        totalComments: 0,
      });
    }

    // Get current user ID if authenticated
    let currentUserId = null;
    const { token } = req.cookies;
    if (token) {
      const validToken = verifyToken(token);
      if (validToken) {
        const user = await usersModel.findOne({ email: validToken.email });
        if (user) {
          currentUserId = user._id;
        }
      }
    }

    // Fetch comments
    const comments = await commentsModel
      .find({
        post: id,
        parentComment: null,
        status: "pending", // Add status filter here too
      })
      .populate({
        path: "replies",
        match: { status: "pending" },
        select: "content author createdAt parentComment",
        populate: { path: "author", select: "name username profileImage" },
      })
      .populate("author", "name username profileImage")
      .lean()
      .sort({ createdAt: -1 }); // Latest comments first

    // Add like counts and isLiked status
    const commentsWithLikes = await Promise.all(
      comments.map(async (comment) => {
        // Get like count for main comment
        const likeCount = await likesModel.countDocuments({ 
          commentId: comment._id 
        });
        
        // Check if current user liked this comment
        const isLiked = currentUserId 
          ? await likesModel.exists({ 
              commentId: comment._id, 
              userId: currentUserId 
            })
          : false;
        
        // Process replies with like counts
        let repliesWithLikes = [];
        if (comment.replies && comment.replies.length > 0) {
          repliesWithLikes = await Promise.all(
            comment.replies.map(async (reply) => {
              const replyLikeCount = await likesModel.countDocuments({ 
                commentId: reply._id 
              });
              
              const replyIsLiked = currentUserId 
                ? await likesModel.exists({ 
                    commentId: reply._id, 
                    userId: currentUserId 
                  })
                : false;
              
              return {
                ...reply,
                likeCount: replyLikeCount,
                isLiked: Boolean(replyIsLiked),
              };
            })
          );
        }
        
        return {
          ...comment,
          likeCount,
          isLiked: Boolean(isLiked),
          replies: repliesWithLikes,
        };
      })
    );

    // Count total comments for this post (not all posts)
    const totalComments = await commentsModel.countDocuments({
      post: id,
      status: "pending",
    });

    return res.status(200).json({
      message: "Fetch Comments Successfully :)",
      comments: commentsWithLikes,
      totalComments,
    });
    
  } catch (error) {
    console.error("Fetch comments error:", error);
    return res.status(500).json({ 
      message: "Internal Server Error",
      comments: [],
      totalComments: 0,
    });
  }
};

export default handler;