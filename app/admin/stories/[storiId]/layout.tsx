import CreateStoriProvider from "@/context/CreateStoriContext";
import isAuthenticated from "@/lib/auth";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await isAuthenticated();
  return <CreateStoriProvider>{children}</CreateStoriProvider>;
}
