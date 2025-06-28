import React from "react";
import { useTheme } from "./theme-provider";
import { Link } from "react-router"; 

const Logo = () => {
  const { theme } = useTheme();
  return (
    <div className="">
      <Link to="/home"> 
        {theme === "light" ? (
          <img
            src="/logo-light.png"
            className="w-40 h-auto"
            alt="Minimal-Blog logo"
          />
        ) : (
          <img
            src="/logo-dark.png"
            className="w-40 h-auto"
            // className="max-w-full h-auto"
            alt="Minimal-Blog logo"
          />
        )}
      </Link>
    </div>
  );
};

export default Logo;