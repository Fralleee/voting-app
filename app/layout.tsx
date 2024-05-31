import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToggleTheme } from "@/components/toggle-theme";

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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ToggleTheme />
          <div className="flex flex-col h-full w-full dark:bg-slate-950 bg-stone-50 relative">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
