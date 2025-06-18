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
import Post from "./Pages/Post";
import BlogDetails from "./Pages/BlogDetails";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route
            element={
                <ProtectedRoutes>
              <AppLayout />
              // </ProtectedRoutes>
            }
          >
            <Route index element={<Navigate replace to="home" />} />
            <Route path="categories" element={<Category />} />
            <Route path="tags" element={<Tag />} />
            <Route path="home" element={<Home />} />
            <Route path="posts" element={<Post />} />
            <Route path="posts/:id" element={< BlogDetails />} />
          </Route>
          {/* <Route path="*" element={<PageNotFound />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        <Toaster/>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
