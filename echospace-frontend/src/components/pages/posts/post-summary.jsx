import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useEchospace } from "../../../controllers/store";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const PostSummary = ({ post }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [{ user }] = useEchospace();
  const userId = user?.email;

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        if (userId) {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/posts/${post.id}/likes/data`,
            {
              params: { userId: userId },
            }
          );
          const { isLikedByUser, likesCount } = response.data;
          setIsLiked(isLikedByUser);
          setLikesCount(likesCount);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchLikes();
  }, [userId]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/posts/${post.id}/unlike`,
          {
            userId,
          }
        );
        setLikesCount(likesCount - 1);
        setIsLiked(false);
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/posts/${post.id}/like`,
          {
            userId,
          }
        );
        setLikesCount(likesCount + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="post-summary">
      <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <Link to={`/posts/${post.id}`}>
          <img class="w-full" src={post.image} alt="Sunset in the mountains" />
        </Link>
        <div class="px-6 py-4">
          <div class="font-bold text-m mb-2">{post.text}</div>
        </div>
        <button className="flex items-center mt-4" onClick={handleLike}>
          {isLiked ? (
            <ThumbUpIcon className="text-green-500" />
          ) : (
            <ThumbUpIcon className="text-lg" />
          )}
          <span className="text-lg ml-2">{likesCount}</span>
        </button>
      </div>
    </div>
  );
};

export default PostSummary;
