"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { IoMdMenu, IoMdClose, IoIosLogOut } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";



const Nav = () => {
  const { data: session } = useSession();
  const [navOpen, setNavOpen] = useState(false);

  const navItems = [
    { url: "/", label: "Home" },
    { url: "/dashboard", label: "Dashboard" },
    { url: "/mytasks", label: "My Tasks" },
    { url: "/calendar", label: "Calendar" },
  ];

  const handleToggle = () => setNavOpen(!navOpen);

  return (
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

  );
};

export default Nav;
