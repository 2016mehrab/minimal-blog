import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { apiClient } from "@/services/apiClient";
import { useLogout } from "@/hooks/useLogout";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import Loader from "./Loader";

const Header = () => {
  const { logoutUser, isLoggingOut } = useLogout();
  const { user, isLoading: isLoadingUser } = useUser();

  async function handlePing() {
    try {
      await apiClient.post("/posts/ping");
      console.log("Ping success");
    } catch (e) {
      console.error("Ping error", e.response?.data || e.message);
    }
  }

  if (isLoadingUser) return <Loader />;
  const isAdmin = user.role.includes("ROLE_ADMIN") || false;
  const hasPermission =
    user.role.includes("ROLE_ADMIN") ||
    user.role.includes("ROLE_EDITOR") ||
    false;

  return (
    <header className="grid grid-cols-[1fr_2fr_1fr] p-4 justify-items-center bg-muted w-full outline-1 outline-amber-950">
      <div></div>
      <nav className="outline-1 outline-blue-500">
        <ul className="flex space-x-4 flex-wrap">
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
                to="/posts"
                className="text-muted-foreground hover:text-foreground"
              >
                Add_Post
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

      <nav className=" outline-1 outline-emerald-600 flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="/user-avatar.png" />
              <AvatarFallback>User Avatar</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Button variant="ghost" asChild>
                <Link
                  to="/drafts"
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  Drafts
                </Link>
              </Button>
            </DropdownMenuItem>

            {hasPermission && (
              <DropdownMenuItem>
                <Button variant="ghost" asChild>
                  <Link
                    to="/posts/pending"
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    Pending
                  </Link>
                </Button>
              </DropdownMenuItem>
            )}
            {isAdmin && (
              <DropdownMenuItem>
                <Button variant="ghost" asChild>
                  <Link
                    to="/register-editor"
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    Register Editor
                  </Link>
                </Button>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Button variant="ghost" asChild>
                <Link
                  to="/posts/user-pending"
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  My Pending
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                className="w-full text-muted-foreground hover:text-foreground"
                variant="ghost"
                onClick={logoutUser}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging Out..." : "Logout"}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Header;
