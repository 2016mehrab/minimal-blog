import React from "react";
import { useTheme } from "./theme-provider";

const Logo = () => {
  const { theme } = useTheme();
  return (
    <div>
      {theme === "light" ? (
        <img src="/logo-light.png" alt="Minimal-Blog logo" />
      ) : (
        <img src="/logo-dark.png" alt="Minimal-Blog logo" />
      )}
    </div>
  );
};

export default Logo;
