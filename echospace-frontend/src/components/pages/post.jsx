import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { v4 as uuid4 } from "uuid";
import { useEchospace } from "../../controllers/store";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DeleteIcon from "@mui/icons-material/Delete";

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [{ user }] = useEchospace();
  const userId = user?.email;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`
        );
        setPost(response.data);

        if (userId) {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}/likes/data`,
            {
              params: { userId: userId },
            }
          );
          const { isLikedByUser, likesCount } = response.data;
          setIsLiked(isLikedByUser);
          setLikesCount(likesCount);
        }
        fetchComments();
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId, userId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}/comments`
      );

      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      return;
    }

    try {
      const commentId = uuid4();
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}/comments/${commentId}`,
        {
          text: newComment,
        }
      );
      const createdComment = response.data;
      setComments([...comments, createdComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}/unlike`,
          {
            userId,
          }
        );
        setLikesCount(likesCount - 1);
        setIsLiked(false);
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}/like`,
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

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`
      );
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="-m-[3.56rem]" />
      <div className="relative flex flex-col justify-center items-center lightbg w-full h-screen pt-12">
        <div className="post-summary">
          <div className="max-w-2xl rounded overflow-hidden shadow-lg flex">
            <img
              className="w-1/2 object-cover"
              src={post.image}
              alt="Sunset in the mountains"
            />
            <div className="w-1/2 p-6 flex flex-col justify-between">
              <div className="font-bold text-m mb-2">{post.text}</div>
              <div className="flex justify-between">
                <button className="flex items-center mt-4" onClick={handleLike}>
                  {isLiked ? <ThumbDownIcon /> : <ThumbUpIcon />}
                  <span className="text-lg ml-2">{likesCount}</span>
                </button>
                <button className="mt-4 text-red-500" onClick={handleDelete}>
                  <DeleteIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
        <form className="mt-4 w-full max-w-lg" onSubmit={handleComment}>
          <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              name="comment"
              placeholder="Add a comment"
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="submit"
            >
              Comment
            </button>
          </div>
        </form>
        <div className="mt-4 w-full max-w-lg">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-100 p-4 rounded-lg mb-2">
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Post;
