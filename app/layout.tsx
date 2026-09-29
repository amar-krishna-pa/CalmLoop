import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Header from "./components/common/header/Header";
import PageTransition from "./components/common/PageTransition";
import { cookies, headers } from "next/headers";
import { auth } from "@/app/lib/auth/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CalmLoop — reflection and practice",
  description: "A space to reflect on OCD and anxiety, map out triggers and explore practice at your own pace.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  const privacyScreenVisible =
    (await cookies()).get("calmloop_privacy_screen")?.value === "visible";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header
            userName={session?.user?.name ?? null}
            privacyScreenVisible={privacyScreenVisible}
          />
          <main className="h-[calc(100dvh-3.5rem)]">
            <PageTransition>{children}</PageTransition>
          </main>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
