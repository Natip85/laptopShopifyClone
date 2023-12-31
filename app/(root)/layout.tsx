import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ToasterContext from "@/context/ToasterContext";
import getCurrentUser from "@/actions/getCurrentUser";
import AuthContext from "@/context/AuthContext";
import TopBar from "@/components/nav/TopBar";
import LeftSidebar from "@/components/nav/LeftSidebar";
import Bottombar from "@/components/nav/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className="bg-stone-100">
        <AuthContext>
          <ToasterContext />
          <TopBar />
          <main className="flex flex-row">
            <LeftSidebar currentUser={currentUser} />
            <section className="flex min-h-screen flex-1 flex-col items-center px-6 pb-10 pt-28 max-md:pb-32 sm:px-10">
              <div className="w-full max-w-5xl">{children}</div>
            </section>
          </main>
          <Bottombar />
        </AuthContext>
      </body>
    </html>
  );
}
