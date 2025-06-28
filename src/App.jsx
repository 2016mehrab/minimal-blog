import React from "react";
import AppLayout from "./components/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Category from "./Pages/Category";
import Tag from "./Pages/Tag";
import Home from "./Pages/Home";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Login from "./Pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Register from "./Pages/Register";
import ResetPassword from "./Pages/ResetPassword";
import ForgotPassword from "./Pages/ForgotPassword";
import { Toaster } from "./components/ui/sonner";
import BlogDetails from "./Pages/BlogDetails";
import Drafts from "./Pages/Drafts";
import EditPostWrapper from "./components/EditPostWrapper";
import PendingPosts from "./Pages/PendingPosts";
import MyPendingBlogs from "./Pages/MyPendingBlogs";
import EditorRegistration from "./Pages/EditorRegistration";
import PageNotFound from "./Pages/PageNotFound";
import Post from "./Pages/Post";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 *60 * 1000,
        throwOnError: true,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>

          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="home" />} />
            <Route path="categories" element={<Category />} />
            <Route path="tags" element={<Tag />} />
            <Route path="home" element={<Home />} />
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route path="create-post" element={<Post />} />
            <Route path="posts/:id" element={<BlogDetails />} />
            <Route path="drafts" element={<Drafts />} />
            <Route path="edit-post/:postId" element={<EditPostWrapper />} />
            <Route path="posts/pending" element={<PendingPosts />} />
            <Route path="posts/my-pending" element={<MyPendingBlogs />} />
            <Route path="drafts/:id" element={<BlogDetails />} />
            <Route path="/register-editor" element={<EditorRegistration />} />
          </Route>

          {/* public routes */}
          <Route path="*" element={<PageNotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
