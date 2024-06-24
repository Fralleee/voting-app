import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/utils/cn";
import { ToggleTheme } from "./_components/toggle-theme";
import { UserSheet } from "./_components/user-sheet";
import { buttonVariants } from "@/components/ui/button";
import { Home, Terminal } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserProvider } from "./_context/UserContext";
import { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Polls | Fralle",
  description: "Probably the best app there is.",
};

export default function RootLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, "bg-card-background md:bg-background")}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <TooltipProvider>
              <div className="absolute top-4 flex w-full justify-center gap-3">
                <ToggleTheme />
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Link
                      prefetch
                      className={buttonVariants({
                        variant: "outline",
                        size: "icon",
                      })}
                      href="/"
                    >
                      <Home />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Home</p>
                  </TooltipContent>
                </Tooltip>
                <UserSheet />
              </div>
              <div className="mx-auto grid min-h-full w-full max-w-[1080px] items-center px-4 md:pb-8 md:pt-20">
                {children}
              </div>
              <div className="absolute left-4 top-4 text-muted-foreground">
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Link
                      href="https://www.fralle.net/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({
                        variant: "outline",
                        size: "icon",
                      })}
                    >
                      <Terminal />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Developer website</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
