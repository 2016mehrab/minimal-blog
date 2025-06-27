import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <div className="grid h-full grid-rows-[1fr_auto] bg-background text-foreground">
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </div>
  );
};

export default AppLayout;
