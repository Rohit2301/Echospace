import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/pages/signup";
import Login from "./components/pages/signin";
import ErrorPage from "./components/pages/404";
import Header from "./components/layouts/header/header";
import SearchUsers from "./components/pages/search-users";
import UserProfile from "./components/pages/user-profile";
import CreatePost from "./components/pages/create-post";
import Post from "./components/pages/post";
import PostsFeed from "./components/pages/posts/posts-feed";
import SearchPosts from "./components/pages/search-posts";
import ProtectedRoute from "./routes/protected-route";

function App() {
  return (
    <Router>
      <Header />
      <div className="h-[3.56rem]" />
      <Routes>
        <Route path="/" element={<PostsFeed />} />
        <Route
          path="/posts/:postId"
          element={
            <ProtectedRoute>
              <Post />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search/users"
          element={
            <ProtectedRoute>
              <SearchUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create/post"
          element={
            // <ProtectedRoute>
            <CreatePost />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/search/posts"
          element={
            <ProtectedRoute>
              <SearchPosts />
            </ProtectedRoute>
          }
        />
        <Route path="/signUp" element={<Signup />} />
        <Route path="/signIn" element={<Login />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
