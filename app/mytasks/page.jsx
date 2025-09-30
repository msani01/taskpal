
import MyTasksContents from "../../components/MyTasksContents";
import { auth } from "../auth";
import { redirect } from "next/navigation";


const page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (<MyTasksContents/>);
};

export default page;
