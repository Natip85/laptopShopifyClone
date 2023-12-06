import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import ToasterContext from "@/context/ToasterContext";
import getCurrentUser from "@/actions/getCurrentUser";
import AuthContext from "@/context/AuthContext";
import Navbar from "./store-components/nav/Navbar";
import CartProvider from "@/context/CartProvider";

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
          <CartProvider>
          <Navbar />
          <main className="flex flex-row">
            
            <section className="flex min-h-screen flex-1 flex-col items-center px-6 pb-10 pt-28 max-md:pb-32 sm:px-10">
              <div className="w-full max-w-5xl">{children}</div>
            </section>
          </main>
          </CartProvider>
        </AuthContext>
      </body>
    </html>
  );
}
