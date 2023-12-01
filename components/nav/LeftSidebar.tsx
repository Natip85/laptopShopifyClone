"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { sidebarLinks } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/types";

interface LeftSidebarProps {
  currentUser: SafeUser | null;
}

const LeftSidebar = ({ currentUser }: LeftSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <section className="custom-scrollbar bg-stone-200 sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-4 bg-dark-2 pb-5 pt-20 max-md:hidden dark:bg-[#030303]">
      <div className="flex w-full flex-1 flex-col gap-1 px-4">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname!.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              href={link.route}
              key={link.label}
              target={link.label === "Live Store" ? "_blank" : undefined}
              className={`hover:bg-neutral-500 relative flex justify-center lg:justify-start gap-3 rounded-lg px-3 py-1 ${
                isActive && "bg-neutral-800 text-white"
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={18}
                height={18}
                className="object-contain"
                style={{ width: "auto" }}
              />
              <p className="max-lg:hidden text-sm">{link.label}</p>
            </Link>
          );
        })}
      </div>
      {currentUser && (
        <div className="mt-10 px-6">
          <button
            className="flex cursor-pointer gap-4 p-4"
            onClick={() => {
              signOut({ redirect: true, callbackUrl: "/auth" });
            }}
          >
            <Image
              src="/assets/logout.svg"
              alt="logout"
              width={24}
              height={24}
            />
            <p className="max-lg:hidden">Logout</p>
          </button>
        </div>
      )}
    </section>
  );
};

export default LeftSidebar;
