import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SearchPosts = () => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/search/posts`,
        {
          params: { searchText },
        }
      );
      setResults(response.data);
    } catch (e) {
      console.log("Err: ", e);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">Search Posts</h2>
      <form
        className="flex items-center border-b border-b-2 border-teal-500 py-2"
        onSubmit={handleSearch}
      >
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Search by text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          required
        />
        <button
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="submit"
        >
          Search
        </button>
      </form>
      <div className="mt-4">
        {results.map((post) => (
          <Link to={`/posts/${post.id}`}>
            <div key={post.id} className="bg-gray-100 p-4 rounded-lg mb-2">
              {post.image && (
                <img className="mt-2 rounded" src={post.image} alt="Post" />
              )}
              <p className="text-gray-700">{post.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPosts;
