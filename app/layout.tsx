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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vote | Fralle",
  description: "Probably the best app there is.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <div className="absolute top-4 flex w-full justify-center gap-3">
            <ToggleTheme />
            <Link
              prefetch
              className={buttonVariants({ variant: "outline", size: "icon" })}
              href="/"
            >
              <Home />
            </Link>
            <UserSheet />
          </div>
          <div className="mx-auto grid min-h-full w-full max-w-[1080px] items-center px-4 md:pb-8 md:pt-20">
            {children}
          </div>
          <div className="absolute left-4 top-4 text-muted-foreground">
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger>
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
            </TooltipProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
