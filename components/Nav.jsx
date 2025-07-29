"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { FaUser } from "react-icons/fa";


const Nav = () => {
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
        <Link href="/auth/signin">
          <button className="flex items-center border rounded-full text-gray-800 px-3 py-1 text-base hover:bg-blue-600 hover:text-white transition">
            <FaUser className="text-lg" />
            <span className="ml-2 hidden sm:inline">Sign In</span> {/* Hidden on small screens */}
          </button>
        </Link>

      </div>

      {/* Mobile Menu Icon */}
      <div className="lg:hidden z-50">
        <button onClick={handleToggle} className="text-3xl text-gray-800">
          {navOpen ? <IoMdClose /> : <IoMdMenu />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {navOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md lg:hidden flex flex-col items-center gap-6 py-10 z-40">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.url}
              className="text-lg text-gray-800 hover:text-blue-600"
              onClick={() => setNavOpen(false)} // Close on click
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#"
            className="text-gray-800 text-lg hover:text-blue-600"
            onClick={() => setNavOpen(false)}
          >
            Contact Us
          </Link>
          <Link href="/auth/signin" onClick={() => setNavOpen(false)}>
            <button className="border rounded-full text-gray-800 px-4 py-2 text-lg hover:bg-blue-600 hover:text-white flex items-center gap-2">
              <span>Sign In</span>
              <FaUser />
            </button>
          </Link>
        </div>
      )}
    </main>
  );
};

export default Nav;
