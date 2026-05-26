"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Button from "@/components/admincomponent/ui/Button";
import Input from "@/components/admincomponent/ui/Input";
import { primaryColor } from "@/app/constants/color";
import AuthBranding from "@/components/admincomponent/ui/AuthBranding";
import AuthCard from "@/components/admincomponent/ui/AuthCard";
import Login from "./actions";

export default function Page() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const formSubmit = (formdata: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await Login(formdata);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <AuthCard>
        <AuthBranding
          title="Korner Admin"
          subtitle="Howfar? You don land for admin corner!"
        />

        {/* Form */}
        <form
          action={formSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {error && (
            <p
              style={{
                color: "#dc2626",
                fontSize: "0.875rem",
                margin: 0,
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="your@email.com"
            disabled={isPending}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            disabled={isPending}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Loader2 size={16} className="animate-spin" /> Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        {/* Footer link */}
        <p
          style={{
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#6B7280",
            margin: 0,
          }}
        >
          Not a Werey??{" "}
          <Link
            href="/admin/signUp"
            style={{ color: primaryColor, fontWeight: 700 }}
          >
            Sign up
          </Link>
        </p>
    </AuthCard>
  );
}
