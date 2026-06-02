import AuthCard from "@/components/admin/ui/AuthCard";
import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <AuthCard>
      <ResetPasswordForm email={email ?? ""} />
    </AuthCard>
  );
}
