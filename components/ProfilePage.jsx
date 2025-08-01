"use client";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const { user } = session;

  return (
    <main className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Profile</h1>

      <div className="flex items-center gap-4 mb-6">
        <Image
          src={user.image || "/default-avatar.png"}
          alt="Your Image"
          width={64}
          height={64}
          className="w-1/2 h-1/2 rounded-full"
        />
        <div>
          <p className="text-lg font-medium">{user.name || "No name"}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span>Total Tasks:</span>
          <span className="font-medium">32</span> {/* I need to replace with the real count */}
        </div>
        <div className="flex justify-between">
          <span>Tasks Completed:</span>
          <span className="font-medium">21</span>
        </div>
        <div className="flex justify-between">
          <span>Joined:</span>
          <span className="font-medium">July 2025</span> {/* Use actual date if stored */}
        </div>
      </div>

      <button
        onClick={() => signOut()}
        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Log Out
      </button>
    </main>
  );
};

export default ProfilePage;
