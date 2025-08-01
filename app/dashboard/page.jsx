
import DashboardContents from "@/components/DashboardContents";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


const page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return <DashboardContents/>;
};

export default page;
