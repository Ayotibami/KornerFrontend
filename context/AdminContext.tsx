"use client";

// AdminContext — makes the logged-in admin's profile (including role) available
// to any client component under the admin/home layout, without prop-drilling.
//
// The profile is fetched once, server-side, in app/admin/home/layout.tsx and
// passed in here as a prop. This context is intentionally read-only — there is
// no setter, since the profile only changes via the profile modal's own
// server action (updateProfile), which triggers a fresh server render.

import React, { useContext } from "react";
import type { AdminProfile } from "@/types/admin";

type AdminContextType = {
  profile: AdminProfile | null;
};

const AdminContext = React.createContext<AdminContextType>({ profile: null });

export default function AdminProvider({
  profile,
  children,
}: {
  profile: AdminProfile | null;
  children: React.ReactNode;
}) {
  return (
    <AdminContext.Provider value={{ profile }}>
      {children}
    </AdminContext.Provider>
  );
}

// Hook for consuming the context. Returns null role/profile if the fetch
// failed upstream — callers should treat a null/missing role as "writer"
// (the more restrictive default), never as "master".
export const useAdmin = () => useContext(AdminContext);
