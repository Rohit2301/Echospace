import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PostSummary from "./post-summary";

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/posts");
        const fetchedPosts = response.data;

        // Fetch likes data for each post
        const postsWithLikes = await Promise.all(
          fetchedPosts.map(async (post) => {
            const likesResponse = await axios.get(
              `http://localhost:4000/api/posts/${post.id}/likes/data`
            );
            const { isLikedByUser, likesCount } = likesResponse.data;
            return { ...post, likesCount, isLiked: isLikedByUser };
          })
        );

        setPosts(postsWithLikes);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="relative flex flex-col justify-center items-center gap-y-8 lightbg">
      <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-5xl">
        Posts
      </h1>
      <Link to="/create/post">
        <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg">
          Create Post
        </button>
      </Link>
      {posts.map((post) => (
        <PostSummary key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsFeed;
