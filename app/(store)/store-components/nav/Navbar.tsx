import Link from "next/link";
import { Redressed } from "next/font/google";
// import CartCount from "./CartCount";
// import UserMenu from "./UserMenu";
import getCurrentUser from "@/actions/getCurrentUser";
// import Categories from "./Categories";
// import Searchbar from "../Searchbar";

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

const Navbar = async () => {
  const currentUser = await getCurrentUser();
  return (
    <div className="sticky top-0 w-full bg-slate-200 z-30 shadow-sm">
      <div className="py-4 border-b-[1px]">
      
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Link
              href={"/store"}
              className={`${redressed.className} font-bold text-2xl`}
            >
              E-Shop
            </Link>
            <div className="hidden md:block">
                searchbar
              {/* <Searchbar /> */}
            </div>
            <div className="flex items-center gap-8 md:gap-12">
                cartcount
              {/* <CartCount /> */}
              usermenu
              {/* <UserMenu currentUser={currentUser} /> */}
            </div>
          </div>
       
      </div>
      categories
      {/* <Categories /> */}
    </div>
  );
};

export default Navbar;
