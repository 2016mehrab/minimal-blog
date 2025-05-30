import React from "react";
import { Button } from "@/components/ui/button"; 
import { Link } from "react-router";

const Header = () => {
  return (
    <header className="p-4 flex justify-center items-center bg-muted">
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Button variant="ghost" asChild>
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <Link to="/categories" className="text-muted-foreground hover:text-foreground">
                Categories
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <Link to="/tags" className="text-muted-foreground hover:text-foreground">
                Tags
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;