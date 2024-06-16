import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
  addDiscussion,
  updateDiscussion,
  deleteDiscussion,
  getDiscussionsByHashtags,
  getDiscussionsByText,
  addCommentToDiscussion,
  addLikeToDiscussion,
  decreaseLikesCount,
  fetchAllDiscussions,
  fetchDiscussionById,
  fetchDiscussionComments,
  getLikesCountAndPresence,
} from "./schemas/discussions.js";
import {
  addUser,
  updateUser,
  deleteUser,
  getAllUsers,
  searchUsersByName,
  getUser,
  unfollowUser,
  followUser,
  getFollowers,
  getFollowing,
} from "./schemas/user.js";

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Echospace server");
});

// Create User
app.post("/api/users", async (req, res) => {
  const { name, mobileNo, email } = req.body;
  try {
    const userId = await addUser(name, mobileNo, email);
    res.status(201).json({ userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User
app.put("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;
  try {
    await updateUser(userId, userData);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete User
app.delete("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    await deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Show user
app.get("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await getUser(userId);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Show list of users
app.get("/api/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search user based on name
app.get("/api/search/users", async (req, res) => {
  const { name } = req.query;
  try {
    const users = await searchUsersByName(name);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to follow a user
app.post("/api/users/:userId/follow", async (req, res) => {
  const { userId } = req.params;
  const { followerId } = req.body;

  try {
    const users = await followUser(userId, followerId);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to unfollow a user
app.delete("/api/users/:userId/unfollow", async (req, res) => {
  const { userId } = req.params;
  const { followerId } = req.body;
  try {
    await unfollowUser(userId, followerId);
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get the list of users a particular user is following
app.get("/api/users/:userId/following", async (req, res) => {
  const { userId } = req.params;

  try {
    const users = await getFollowing(userId);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get the list of users a particular user is followed by
app.get("/api/users/:userId/followed", async (req, res) => {
  const { userId } = req.params;

  try {
    const users = await getFollowers(userId);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Discussion
app.post("/api/posts", async (req, res) => {
  const { text, image, hashtags, userId } = req.body;
  try {
    const discussionId = await addDiscussion(text, image, hashtags, userId);
    res.status(201).json({ postId: discussionId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Discussion
app.put("/api/posts/:discussionId", async (req, res) => {
  const { discussionId } = req.params;
  const discussionData = req.body;
  try {
    await updateDiscussion(discussionId, discussionData);
    res.status(200).json({ message: "Discussion updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Discussion
app.delete("/api/posts/:discussionId", async (req, res) => {
  const { discussionId } = req.params;
  try {
    await deleteDiscussion(discussionId);
    res.status(200).json({ message: "Discussion deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch all discussions
app.get("/api/posts", async (req, res) => {
  try {
    const discussions = await fetchAllDiscussions();
    res.status(200).json(discussions);
  } catch (error) {
    console.error("Error fetching discussions:", error);
    res.status(500).json({ error: "Failed to fetch discussions" });
  }
});

// Endpoint to fetch a single discussion by ID
app.get("/api/posts/:discussionId", async (req, res) => {
  const { discussionId } = req.params;
  try {
    const discussion = await fetchDiscussionById(discussionId);
    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }
    res.status(200).json(discussion);
  } catch (error) {
    console.error("Error fetching discussion:", error);
    res.status(500).json({ error: "Failed to fetch discussion" });
  }
});

// Get list of discussions based on tags
app.post("/api/posts/tags", async (req, res) => {
  const { tags } = req.body;
  try {
    const discussions = await getDiscussionsByHashtags(tags);
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get list of discussions based on text in Text field
app.get("/api/search/posts", async (req, res) => {
  const { searchText } = req.query;
  try {
    const discussions = await getDiscussionsByText(searchText);
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// add comment on a discussion
app.post("/api/posts/:discussionId/comments/:commentId", async (req, res) => {
  const { discussionId, commentId } = req.params;
  const { text } = req.body;
  try {
    const newComment = await addCommentToDiscussion(
      discussionId,
      text,
      commentId
    );
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to list comments in a discussion
app.get("/api/posts/:discussionId/comments", async (req, res) => {
  const { discussionId } = req.params;

  try {
    const comments = await fetchDiscussionComments(discussionId);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching discussion comments:", error);
    res.status(500).json({ error: "Failed to fetch discussion comments" });
  }
});

//likes a discussion
app.post("/api/posts/:discussionId/like", async (req, res) => {
  const { discussionId } = req.params;
  const { userId } = req.body;
  try {
    await addLikeToDiscussion(discussionId, userId);
    res.status(201).json({ message: "Like added successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//dislikes a discussion
app.post("/api/posts/:discussionId/unlike", async (req, res) => {
  const { discussionId } = req.params;
  const { userId } = req.body;
  try {
    await decreaseLikesCount(discussionId, userId);
    res.status(200).json({ message: "Likes count decreased successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get likes count and check if user liked a discussion
app.get("/api/posts/:discussionId/likes/data", async (req, res) => {
  const { discussionId } = req.params;
  const { userId } = req.query;

  try {
    const { likesCount, isLikedByUser } = await getLikesCountAndPresence(
      discussionId,
      userId
    );
    res.status(200).json({ likesCount, isLikedByUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
