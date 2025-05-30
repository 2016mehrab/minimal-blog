import React from "react";
import AppLayout from "./components/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Category from "./Pages/Category";
import Tag from "./Pages/Tag";
import Home from "./Pages/Home";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Login from "./Pages/Login";

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
              //   <ProtectedRoutes>
              <AppLayout />
              // {/* </ProtectedRoutes> */}
            }
          >
            <Route index element={<Navigate replace to="home" />} />
            <Route path="categories" element={<Category />} />
            <Route path="tags" element={<Tag />} />
            <Route path="home" element={<Home />} />
          </Route>
          {/* <Route path="*" element={<PageNotFound />} /> */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
