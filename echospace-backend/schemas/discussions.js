import { db } from "../firebase.js";
import {
  where,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  deleteDoc,
  collection,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// Function to add a discussion
export async function addDiscussion(text, image, hashtags, userId) {
  const discussionsRef = doc(db, "discussions", uuidv4());

  try {
    await setDoc(discussionsRef, {
      text: text,
      image: image,
      hashtags: hashtags,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      likes: [],
    });

    console.log("Discussion added successfully");
    return discussionsRef.id;
  } catch (error) {
    console.error("Error adding discussion: ", error);
    throw new Error("Failed to add discussion");
  }
}

// Function to update a discussion
export async function updateDiscussion(discussionId, updatedData) {
  const discussionRef = doc(db, "discussions", discussionId);

  try {
    await updateDoc(discussionRef, updatedData);
    console.log("Discussion updated successfully");
  } catch (error) {
    console.error("Error updating discussion: ", error);
    throw new Error("Failed to update discussion");
  }
}

// Function to delete a discussion
export async function deleteDiscussion(discussionId) {
  const discussionRef = doc(db, "discussions", discussionId);

  try {
    await deleteDoc(discussionRef);
    console.log("Discussion deleted successfully");
  } catch (error) {
    console.error("Error deleting discussion: ", error);
    throw new Error("Failed to delete discussion");
  }
}

// Function to fetch all discussions from Firestore
export async function fetchAllDiscussions() {
  const discussionsRef = collection(db, "discussions");
  const snapshot = await getDocs(discussionsRef);
  const discussions = [];

  snapshot.forEach((doc) => {
    discussions.push({ id: doc.id, ...doc.data() });
  });

  return discussions;
}

// Function to fetch a single discussion by ID from Firestore
export async function fetchDiscussionById(discussionId) {
  const discussionRef = doc(db, "discussions", discussionId);
  const discussion = await getDoc(discussionRef);

  if (!discussion.exists) {
    return null;
  }

  return { id: discussion.id, ...discussion.data() };
}

// Function to fetch discussions based on hashtags
export async function getDiscussionsByHashtags(hashtags) {
  const discussionRef = collection(db, "discussions");
  const q = query(
    discussionRef,
    where("hashtags", "array-contains-any", hashtags)
  );

  try {
    const discussionsSnapshot = await getDocs(q);
    const discussions = [];
    discussionsSnapshot.forEach((doc) => {
      discussions.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return discussions;
  } catch (error) {
    console.error("Error fetching discussions: ", error);
    throw new Error("Failed to fetch discussions");
  }
}

// Function to fetch discussion based on texts
export async function getDiscussionsByText(searchText) {
  const discussionRef = collection(db, "discussions");

  try {
    const discussionsSnapshot = await getDocs(discussionRef);
    const discussions = [];

    discussionsSnapshot.forEach((doc) => {
      const discussionData = doc.data();
      if (
        discussionData.text.toLowerCase().includes(searchText.toLowerCase())
      ) {
        discussions.push({
          id: doc.id,
          ...discussionData,
        });
      }
    });

    return discussions;
  } catch (error) {
    console.error("Error fetching discussions by text: ", error);
    throw new Error("Failed to fetch discussions by text");
  }
}

//Function to add comment in a discussion
export async function addCommentToDiscussion(discussionId, text, commentId) {
  const comment = {
    id: commentId,
    text,
    createdAt: new Date(),
  };
  const discussionRef = doc(db, "discussions", discussionId);
  console.log("comment", comment);
  try {
    await updateDoc(discussionRef, {
      comments: arrayUnion(comment),
    });
  } catch (e) {
    console.log(e);
  }

  return comment;
}

// Function to fetch comments in a discussion from Firestore
export async function fetchDiscussionComments(discussionId) {
  const discussionRef = doc(db, "discussions", discussionId);
  const discussion = await getDoc(discussionRef);

  if (!discussion.exists) {
    throw new Error("Discussion not found");
  }

  const discussionData = discussion.data();
  const comments = discussionData.comments || [];
  return comments;
}

// likes a post
export async function addLikeToDiscussion(discussionId, userId) {
  const discussionRef = doc(db, "discussions", discussionId);
  await updateDoc(discussionRef, {
    likes: arrayUnion(userId),
  });
}

// dislikes a post
export async function decreaseLikesCount(discussionId, userId) {
  const discussionRef = doc(db, "discussions", discussionId);
  await updateDoc(discussionRef, {
    likes: increment(userId),
  });
}

// Function to fetch likes count and check if userId is present
export async function getLikesCountAndPresence(discussionId, userId) {
  const discussionRef = doc(db, "discussions", discussionId);

  try {
    const discussionDoc = await getDoc(discussionRef);
    if (discussionDoc.exists()) {
      const discussionData = discussionDoc.data();
      const likes = discussionData.likes || [];
      const likesCount = likes.length;
      const isLikedByUser = likes.includes(userId);
      return { likesCount, isLikedByUser };
    } else {
      throw new Error("Discussion not found");
    }
  } catch (error) {
    console.error("Error fetching discussion:", error);
    throw new Error("Failed to fetch discussion likes");
  }
}
