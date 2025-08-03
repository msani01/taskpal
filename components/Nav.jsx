"use client";
import page from "@/app/page";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
<<<<<<< HEAD
import { IoMdMenu, IoMdClose, IoIosLogOut } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";

=======
import { IoMdMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
>>>>>>> parent of ee17db1 (progress)


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
<<<<<<< HEAD
 <main className="flex items-center justify-between mx-auto p-3 relative bg-white">
  {/* Logo */}
  <Link href="/" className="flex items-center gap-2">
    <Image
      src="/logo.png"
      alt="logo"
      width={40}
      height={40}
      className="h-10 w-10 max-md:h-8 max-md:w-8"
    />
    <p className="font-bold text-xl text-gray-800 max-sm:text-sm">TaskPal</p>
  </Link>

  {/* Desktop Nav */}
  <div className="hidden lg:flex items-center gap-8 text-gray-800">
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

  {/* Desktop Buttons */}
  <div className="hidden lg:flex items-center gap-5">
    {!session ? (
      <button
        onClick={() => signIn()}
        className="flex items-center border rounded-full text-gray-800 px-3 py-1 text-base hover:bg-blue-600
         hover:text-white transition">
        <FaUser className="text-lg" />
        <span className="ml-2 hidden sm:inline">Sign In</span>
      </button>
    ) : (
      <div className="flex items-center gap-2 text-sm">
        {/* <span className="text-gray-700">Hi, {session.user.name?.split(" ")[0]}</span> */}
        <button
          onClick={() => signOut()}
          className="px-3 hidden md:inline-block py-1 rounded bg-gray-100 text-gray-800
          hover:bg-gray-200 text-sm ">
          Sign Out
        </button>
        {/* <button
        onClick={() => signOut()}
        className="inline-block md:hidden text-gray-800 text-2xl hover:text-red-600">
        <IoIosLogOut/>
        </button> */}
      </div>
    )}
  </div>

  {/* Mobile */}
  <div className="lg:hidden z-50 flex items-center gap-3">
    {!session ? (
      <button onClick={() => signIn()} className="text-2xl text-gray-800">
        <FaUser />
      </button>
    ) : (
      <button onClick={() => signOut()} className="text-sm text-gray-700 px-2 py-1 rounded border">
        Sign Out
      </button>
    )}
    <button onClick={handleToggle} className="text-3xl text-gray-800">
      {navOpen ? <IoMdClose /> : <IoMdMenu />}
    </button>
  </div>

  {/* Mobile Menu Display */}
  {navOpen && (
    <div className="absolute top-16 left-0 w-full bg-white shadow-md lg:hidden flex flex-col items-center gap-6 py-10 z-40">
      {navItems.map((item, i) => (
        <Link
          key={i}
          href={item.url}
          className="text-lg text-gray-800 hover:text-blue-600"
          onClick={() => setNavOpen(false)}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )}
</main>

=======
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
>>>>>>> parent of ee17db1 (progress)
  );
};

export default Nav;
