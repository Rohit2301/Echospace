import { db } from "../firebase.js";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// Function to add a new user
export async function addUser(name, mobileNo, email) {
  const userRef = doc(db, "users", email);
  const userDoc = await getDoc(userRef);

  try {
    if (userDoc.exists()) {
      throw new Error("User already exists");
    }

    const q = query(collection(db, "users"), where("mobileNo", "==", email));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot) {
      throw new Error("Email already exists");
    }

    await setDoc(userRef, {
      name: name,
      mobileNo: mobileNo,
      email: email,
      following: [],
      followed: [],
    });
    console.log("User added successfully");

    return userRef.id;
  } catch (error) {
    console.error("Error adding user: ", error);

    throw new Error("Failed to add user: " + error);
  }
}

// Function to update user details
export async function updateUser(userId, updatedData) {
  const userRef = doc(db, "users", userId);

  try {
    await setDoc(userRef, updatedData);
    console.log("User updated successfully");
  } catch (error) {
    console.error("Error updating user: ", error);
    throw new Error("Failed to update user");
  }
}

// Function to delete a user
export async function deleteUser(userId) {
  const userRef = doc(db, "users", userId);

  try {
    await deleteDoc(userRef);
    console.log("User deleted successfully");

    const usersRef = collection(db, "users");
    const usersQuery = query(
      usersRef,
      where("followed", "array-contains", userId)
    );
    const querySnapshot = await getDocs(usersQuery);

    querySnapshot.forEach(async (cdoc) => {
      const userDocRef = doc(db, "users", cdoc.id);
      await updateDoc(userDocRef, {
        followed: arrayRemove(userId),
      });
    });
    const usersQuery2 = query(
      usersRef,
      where("following", "array-contains", userId)
    );
    const querySnapshot2 = await getDocs(usersQuery2);

    querySnapshot2.forEach(async (cdoc) => {
      const userDocRef = doc(db, "users", cdoc.id);
      await updateDoc(userDocRef, {
        following: arrayRemove(userId),
      });
    });

    console.log(
      `Removed ${querySnapshot.size} users from their followed arrays`
    );
  } catch (error) {
    console.error("Error deleting user: ", error);
    throw new Error("Failed to delete user");
  }
}

// Function to fetch user
export async function getUser(userId) {
  const userRef = doc(db, "users", userId);
  try {
    const user = await getDoc(userRef);
    return { id: user.id, ...user.data() };
  } catch (e) {
    throw new Error(e);
  }
}

// Function to fetch list of all users
export async function getAllUsers() {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const users = [];
  usersSnapshot.forEach((doc) => {
    users.push({
      ...doc.data(),
    });
  });

  return users;
}

// Function to search for users based on name
export async function searchUsersByName(name) {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const users = [];

  usersSnapshot.forEach((doc) => {
    const userData = doc.data();
    if (userData.name.toLowerCase().includes(name.toLowerCase())) {
      users.push(userData);
    }
  });

  return users;
}

// Function to follow a user
export async function followUser(userId, followerId) {
  const userRef = doc(db, "users", userId);
  const followerRef = doc(db, "users", followerId);
  try {
    await updateDoc(userRef, {
      following: arrayUnion(followerId),
    });
    await updateDoc(followerRef, {
      followed: arrayUnion(userId),
    });
    return { message: "Followed successfully" };
  } catch (error) {
    throw new Error("Error following user: " + error.message);
  }
}

// Function to unfollow a user
export async function unfollowUser(userId, followerId) {
  const userRef = doc(db, "users", userId);
  const followerRef = doc(db, "users", followerId);

  try {
    await updateDoc(userRef, {
      following: arrayRemove(followerId),
    });
    await updateDoc(followerRef, {
      followed: arrayRemove(userId),
    });
    return { message: "Unfollowed successfully" };
  } catch (error) {
    throw new Error("Error unfollowing user: " + error.message);
  }
}

// Function to get the list of users a particular user is following
export async function getFollowing(userId) {
  const userRef = doc(db, "users", userId);
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.following || [];
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error("Error fetching following list: " + error.message);
  }
}

// Function to get the list of users a particular user is followed by
export async function getFollowers(userId) {
  const userRef = doc(db, "users", userId);
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.followed || [];
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error("Error fetching following list: " + error.message);
  }
}
