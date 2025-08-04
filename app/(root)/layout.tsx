import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlogHub - Multi-tenant Blog Platform",
  description: "Create and manage beautiful blogs for your organization. Share insights, stories, and knowledge with your team and the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <SignedOut>
            <div className="min-w-screen min-h-screen flex justify-center items-center">
              <SignIn routing='hash' />
            </div>
          </SignedOut>
          <SignedIn> {children}</SignedIn>
        </ClerkProvider>
      </body>
    </html>
  );
}
