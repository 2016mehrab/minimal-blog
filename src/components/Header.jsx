import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { apiClient } from "@/services/apiClient";
import { useLogout } from "@/hooks/useLogout";

const Header = () => {
  const { logoutUser, isLoggingOut } = useLogout();

  async function handlePing() {
    try {
      await apiClient.post("/posts/ping");
      console.log("Ping success");
    } catch (e) {
      console.error("Ping error", e.response?.data || e.message);
    }
  }

  return (
    <header className="grid grid-cols-[1fr_2fr_1fr] p-4 justify-items-center bg-muted w-full outline-1 outline-amber-950">
      <div></div>
      <nav className="outline-1 outline-blue-500">
        <ul className="flex space-x-4">
          <li>
            <Button variant="ghost" asChild>
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <Link
                to="/categories"
                className="text-muted-foreground hover:text-foreground"
              >
                Categories
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <Link
                to="/tags"
                className="text-muted-foreground hover:text-foreground"
              >
                Tags
              </Link>
            </Button>
          </li>
        </ul>
      </nav>

      <nav className=" outline-1 outline-emerald-600 justify-self-end ">
        <ul className="flex gap-2">
          <li>
            <Button onClick={handlePing} variant="outline">
              Ping
            </Button>
          </li>
          <li>
            <Button
              variant="outline"
              onClick={logoutUser}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging Out..." : "Logout"}
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
