import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/utils/cn";
import { ToggleTheme } from "./_components/toggle-theme";
import { UserSheet } from "./_components/user-sheet";
import { UserDrawer } from "./_components/user-drawer";

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
      <body className={cn(inter.className, "bg-stone-50 dark:bg-slate-950")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="absolute top-4 flex w-full justify-center gap-3">
            <ToggleTheme />
            <UserSheet />
          </div>
          <div className="mx-auto grid h-full w-full max-w-[1080px] items-center px-4 pb-8 pt-20">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
