
import MyTasksContents from "@/components/MyTasksContents";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";


const page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div>
      <ProtectedRoute>
        <MyTasksContents/>;
      </ProtectedRoute>
      
    </div>
  )  
};

export default page;
