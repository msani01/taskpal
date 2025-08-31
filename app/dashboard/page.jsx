
import DashboardContents from "@/components/DashboardContents";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";


const page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }
  return (
    <ProtectedRoute>
      <DashboardContents session={session}/>
    </ProtectedRoute>
 ) 
 
};

export default page;
