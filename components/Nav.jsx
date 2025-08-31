"use client";
import page from "@/app/page";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";


const Nav = () => {
  const { data: session } = useSession();
  const [navOpen, setNavOpen] = useState(false);

  // handler function for nav open
  const handleOpen = () => {
    setNavOpen(!navOpen);
  };

  console.log(navOpen);

  const navItems = [
    { url: "/", label: "Home" },
    { url: "/aboutUs", label: "About Us" },
    { url: "/features", label: "Features" },
    { url: "/faqs", label: "FAQs" },
    { url: "/testimonials", label: "Testimonials" },
    { url: "/blogs", label: "Blogs" },
  ];

  return (
    <main className="flex items-center justify-between mx-auto shadow-2xl shadow-gray-600 ">
      {/* logo and name */}
      <Link href={"./page.jsx"} className="flex items-center justify-center p-3 ">
      <Image 
      src={"/logo.png"}
      alt="logo"
      width={800}
      height={800}
      className="h-10 w-10 max-md:h-8 max-md:w-8"
      />
       <p className="font-bold text-xl text-gray-800 max-sm:text-sm">
          TaskPal
        </p>
      </Link>
      {/* logo and name stop */}

      {/* nav components */}
      <div className="flex items-center justify-center text-gray-800 gap-8 max-lg:hidden p-3 ">
        {navItems.map((item, i) => (
          <Link
            key={i}
            href={item.url}
            className="text-lg hover:text-blue-600 transition-colors duration-200"
          >
            {item.label}
          </Link>
        ))}

      </div>
      {/* nav components stop*/}

      {/* sign in and contact us */}
      <div className="flex items-center justify-center p-3 gap-5 max-lg:hidden">
        <Link href={"#"} className="text-gray-800 text-lg hover:text-blue-600 transition-all duration-200
        flex items-center justify-center gap-2 ">
        Contact Us
        </Link>

        <Link href={"#"}>
        <button className="border rounded-full text-gray-800 px-3 py-1 text-lg hover:bg-blue-600">
          <p>
            Sign In
          </p>
        </button>
        </Link>
      </div>
      {/* sign in and contact us  stop */}

      {/* Mobile to tablet view */}
      {navOpen ? (
        <div className="h-dvh w-full overflow-hidden lg:hidden absolute text-gray-800 hover:text-blue-600 
        top-0 right-0 bg-white flex flex-col items-center justify-center gap-10 py-14 my-14 ">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.url}
              className="text-lg hover:text-blue-600 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="lg:hidden z-50 mt-1">
        <button onClick={handleOpen} className="text-2xl text-gray-800 hover:text-blue-600">
          {navOpen ? <IoMdClose className="mr-3"/> : <IoMdMenu className="mr-3"/> }
        </button>
      </div>


      

    </main>
  );
};

export default Nav;
