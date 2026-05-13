import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const isAuthenticated = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    redirect("/admin/login");
  }
};

export default isAuthenticated;
