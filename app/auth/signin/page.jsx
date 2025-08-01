import React from 'react'
import { auth, signIn } from "@/auth"; // server-side function
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <Nav />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-blue-100 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome.</h1>

          <div className="space-y-6">
            {/* Sign in with Google */}
            <form action={async () => {
              "use server";
              await signIn("google");
            }}>
              <button className="w-full py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                Sign in with Google
              </button>
            </form>

            {/* Sign in with GitHub */}
            <form action={async () => {
              "use server";
              await signIn("github");
            }}>
              <button className="w-full py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition">
                Sign in with GitHub
              </button>
            </form>


            <button
              className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              disabled
              title="Facebook not configured"
            >
              Sign in with Facebook 
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-8">
            By signing in, you agree to our{" "}
            <Link href="#" className="underline hover:text-gray-700">
              Terms & Conditions
            </Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default page;
