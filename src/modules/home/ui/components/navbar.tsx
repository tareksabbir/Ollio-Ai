"use client";
import UserControl from "@/components/clerk/user-controler";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Moon, Sun, Github } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="p-4 bg-transparent fixed top-0 right-0 left-0 z-50 transition-all duration-200 border-b border-transparent">
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="ollio" width={32} height={32} />
          <span className="font-semibold text-lg">Ollio</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* GitHub Link */}
          <Button variant="ghost" size="icon" asChild className="w-9 h-9">
            <Link
              href="https://github.com/yourusername/yourrepo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>

          <SignedOut>
            <div className="flex gap-2">
              <SignUpButton>
                <Button variant="outline" size="sm">
                  Sign Up
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            <UserControl showName />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
