import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";


const Footer = () => {
  const footerItems = [
    { url: "#", label: "About Us" },
    { url: "#", label: "Chat with Us" },
    { url: "#", label: "Blog" },
    { url: "#", label: "Privacy Policy" },
    { url: "#", label: "Terms of Use" },
  ];
  return (
    <main className="px-10 py-4 bg-gray-500 border-top border-gray-300 flex max-lg:flex-col 
    max-lg:gap-3 items-center justify-between">
      <Link href={"/"} className="flex items-center gap-1 z-50">
        <Image
          src={"/bgimage.png"}
          alt="logo"
          width={800}
          height={800}
          className="w-8 h-8 max-md:h-8 max-md:w-8"
        />
        <p className="font-bold text-xl text-black max-sm:text-sm">TaskPal</p>
      </Link>

      <div className="flex max-lg:flex-col items-center gap-3 justify-center text-sm">
        {footerItems.map((item, i) => (
          <Link
            key={i}
            href={item.url}
            className="hover:underline transition-all text-gray-700 hover:text-black"
          >
            {item.label}
          </Link>
        ))}
        <div className="flex items-center gap-3 text-xl text-gray-700">
        <FaFacebook className="hover:text-black transition-all" />
        <FaInstagram className="hover:text-black transition-all"/>
        <FaXTwitter className="hover:text-black transition-all"/>
      </div>

      </div>

      <div className="text-center md:text-right text-gray-700">
        {new Date().getFullYear()} TaskPal. All rights reserved.
      </div>

      
    </main>
  );
};

export default Footer;
