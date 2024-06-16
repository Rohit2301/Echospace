import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEchospace } from "../../controllers/store";
import { getAuth, deleteUser } from "firebase/auth";
import { Loader } from "../layouts/loader/loader";

const UserProfile = () => {
  const { userId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [{ user }, { logOut }] = useEchospace();
  const userEmail = user?.email;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`
        );
        setCurrentUser(userResponse.data);

        // Fetch following list
        const followingResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/following`
        );
        setFollowing(followingResponse.data);

        // Check if current user is following this user
        setIsFollowing(followingResponse.data.includes(userEmail));

        // Fetch followers list
        const followersResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/followed`
        );
        setFollowers(followersResponse.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUser();
  }, [userEmail, userId]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Unfollow user
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/unfollow`,
          {
            data: { followerId: userEmail },
          }
        );
        setIsFollowing(false);
        setFollowing(following.filter((id) => id !== userEmail));
      } else {
        // Follow user
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/follow`,
          {
            followerId: userEmail,
          }
        );
        setIsFollowing(true);
        setFollowing([...following, userEmail]);
      }
    } catch (error) {
      console.error(
        `Error ${isFollowing ? "unfollowing" : "following"} user:`,
        error
      );
    }
  };

  const handleDeleteUser = async () => {
    try {
      // logOut({ auth });
      const auths = getAuth();
      const user = auths.currentUser;
      await deleteUser(user);

      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`
      );
      navigate("/");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (!currentUser) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">{currentUser.name}</h2>
        <h2 className="text-gray-600">{currentUser.email}</h2>
        <h2 className="text-gray-600">{currentUser.mobileNo}</h2>
        <button
          className={`mt-4 py-2 px-4 rounded ${
            isFollowing
              ? "bg-red-500 hover:bg-red-700"
              : "bg-teal-500 hover:bg-teal-700"
          } text-white`}
          onClick={handleFollow}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
        {user?.email === userId ? (
          <button
            className="mt-4 ml-2 py-2 px-4 rounded bg-red-500 hover:bg-red-700 text-white"
            onClick={handleDeleteUser}
          >
            Delete Account
          </button>
        ) : null}
      </div>

      <div>
        <h3 className="text-lg font-semibold">
          Followers ({following.length})
        </h3>
        <ul className="list-disc list-inside ml-4">
          {following.map((userId) => (
            <li key={userId} className="text-gray-700">
              {userId}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold">
          Following ({followers.length})
        </h3>
        <ul className="list-disc list-inside ml-4">
          {followers.map((userId) => (
            <li key={userId} className="text-gray-700">
              {userId}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;
