import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SearchUsers = () => {
  const [name, setName] = useState("");
  const [initialUsers, setInitialUsers] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users`
        );
        setInitialUsers(response.data);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/search/users`,
        {
          params: { name: name },
        }
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
      setResults([]); // Clear results on error
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">Search Users</h2>
      <form
        className="flex items-center border-b border-b-2 border-teal-500 py-2"
        onSubmit={handleSearch}
      >
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Search by username"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        {results.length > 0
          ? results.map((user) => (
              <Link key={user.email} to={`/users/${user.email}`}>
                <div className="bg-gray-100 p-4 rounded-lg mb-2">
                  <p className="text-gray-700">{user.name}</p>
                </div>
              </Link>
            ))
          : initialUsers.map((user) => (
              <Link key={user.email} to={`/users/${user.email}`}>
                <div className="bg-gray-100 p-4 rounded-lg mb-2">
                  <p className="text-gray-700">{user.name}</p>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default SearchUsers;
