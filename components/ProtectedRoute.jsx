// components/ProtectedRoute.js
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // redirect if not logged in
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
