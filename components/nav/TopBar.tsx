import { Redressed } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

const TopBar = () => {
  return (
    <nav className="fixed top-0 z-30 flex w-full items-center justify-between px-6 py-3 bg-black">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p
          className={`max-lg:hidden text-xl font-bold tracking-[1.3px] ${redressed.className} text-white`}
        >
          Next-Winworks
        </p>
      </Link>
      <div className="flex items-center gap-4 text-white">user menu</div>
    </nav>
  );
};

export default TopBar;
