import React, { useState } from "react";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useEchospace } from "../../controllers/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [{ user }, { setLoading }] = useEchospace();
  const navigate = useNavigate();

  const handlePost = async (e) => {
    e.preventDefault();
    const imageName = uuidv4();
    const imageRef = ref(storage, `posts/${imageName}`);

    await uploadBytes(imageRef, image);

    const imageUrl = await getDownloadURL(imageRef);
    const email = user?.email;
    const postData = {
      text,
      image: imageUrl,
      hashtags: [],
      userId: email,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts`,
        postData
      );
      navigate(`/posts/${response.data.postId}`);
      console.log("Post created successfully:", response.data);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
      setText("");
      setImage(null);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">Create Post</h2>
      <form onSubmit={handlePost} className="space-y-4">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button
          type="submit"
          className="w-full py-3 bg-teal-500 hover:bg-teal-700 text-white font-bold rounded-lg"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
