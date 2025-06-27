import React from "react";
import { Button } from "@/components/ui/button";
import { Link, NavLink } from "react-router";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BadgeCheckIcon, LogInIcon, MenuIcon } from "lucide-react";
import { Badge } from "./ui/badge";

const Header = () => {
  const { logoutUser, isLoggingOut } = useLogout();
  const { user, isLoading: isLoadingUser } = useUser();

  if (isLoadingUser) return <Loader />;

  const isAuthenticated = !!user;
  const isAdmin = user?.role.includes("ROLE_ADMIN") || false;
  const hasPermission =
    isAuthenticated &&
    (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_EDITOR"));

  const getNavLinkClasses = ({ isActive }) =>
    isActive
      ? "text-sm font-medium transition-colors text-primary hover:text-muted-foreground"
      : "text-sm font-medium transition-colors text-muted-foreground hover:text-primary";

  return (
    <header className="sticky top-0 z-50  border-b  backdrop-blur supports-[backdrop-filter]:bg-background/60 grid grid-cols-[1fr_2fr_1fr] p-4 justify-items-center bg-muted w-full ">
      <div></div>

      <div className="ml-auto  flex md:hidden items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className={""} size="icon">
              <MenuIcon className="!size-8 " />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-8">
            <nav className="flex flex-col gap-4 text-lg font-medium pt-8">
              <NavLink to="/home" className={getNavLinkClasses}>
                Home
              </NavLink>
              {isAuthenticated && (
                <NavLink
                  to="/create-post"
                  className={getNavLinkClasses}
                  end={true}
                >
                  Add Post
                </NavLink>
              )}
              <NavLink to="/categories" className={getNavLinkClasses}>
                Categories
              </NavLink>
              <NavLink to="/tags" className={getNavLinkClasses}>
                Tags
              </NavLink>
              {isAuthenticated ? (
                <>
                  <hr className="my-2" />
                  <NavLink to="/drafts" className={getNavLinkClasses}>
                    Drafts
                  </NavLink>
                  {hasPermission && (
                    <NavLink to="/posts/pending" className={getNavLinkClasses}>
                      Pending
                    </NavLink>
                  )}
                  {isAdmin && (
                    <NavLink
                      to="/register-editor"
                      className={getNavLinkClasses}
                    >
                      Register Editor
                    </NavLink>
                  )}
                  <NavLink
                    to="/posts/user-pending"
                    className={getNavLinkClasses}
                  >
                    My Pending
                  </NavLink>
                  <hr className="my-2" />
                  <Button
                    className="w-full justify-start text-lg font-medium text-muted-foreground hover:text-primary px-0"
                    variant="ghost"
                    onClick={logoutUser}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? "Logging Out..." : "Logout"}
                  </Button>
                </>
              ) : (
                <>
                  <hr className="my-2" />
                  <NavLink to={"/login"} className={getNavLinkClasses}>
                    <LogInIcon className="!size-4" />
                  </NavLink>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* large screen */}
      <nav className="hidden md:flex ">
        <ul className="flex  space-x-4 flex-wrap">
          <li className="px-2 flex items-center">
            <NavLink to="/home" end={true} className={getNavLinkClasses}>
              Home
            </NavLink>
          </li>
          {isAuthenticated && (
            <li className="px-2 flex items-center">
              <NavLink to="/create-post" className={getNavLinkClasses}>
                Add-Post
              </NavLink>
            </li>
          )}
          <li className="px-2 flex items-center ">
            <NavLink to="/categories" className={getNavLinkClasses}>
              Categories
            </NavLink>
          </li>
          <li className="px-2 flex items-center">
            <NavLink to="/tags" className={getNavLinkClasses}>
              Tags
            </NavLink>
          </li>
        </ul>
      </nav>

      <nav className=" hidden  md:flex items-center">
        {isAuthenticated ? (
          <DropdownMenu>
            {user ? (
              <Badge variant={"default"}>
                <BadgeCheckIcon /> {user.role[0]}
              </Badge>
            ) : null}
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
        ) : (
          <Button asChild>
            <Link to={"/login"}>
              <LogInIcon className="!size-4" />
              Login
            </Link>
          </Button>
        )}
      </nav>
    </header>
  );
};

export default Header;
