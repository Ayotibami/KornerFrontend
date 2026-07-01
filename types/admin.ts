// Shape of the admin profile returned by GET /admin/profile.
// Used in the Navbar to show the admin's name and avatar.
export type AdminProfile = {
  admin_name: string;
  email: string;
  avatar_url?: string; // Optional — admin may not have uploaded a profile picture yet
  bio?: string | null;
  role: "master" | "writer";
};

// Shape returned by the master-only GET /master/admins (list every admin).
// is_self flags the requesting master's own row, computed server-side, so
// the writers page can hide the Unverify button there without needing to
// know its own admin_id.
export type AdminListItem = {
  admin_id: string;
  admin_name: string;
  avatar_url: string;
  is_verified: boolean;
  is_self: boolean;
  role: "master" | "writer";
};

// Shape returned by the master-only GET /master/admins/:adminId — the full
// detail view, fetched on demand when a master clicks an avatar on the
// writers page (the list endpoint above only has enough for the row itself).
export type AdminDetail = {
  admin_id: string;
  admin_name: string;
  email: string;
  role: "master" | "writer";
  avatar_url: string;
  bio: string | null;
  is_verified: boolean;
  // True only for the one account no other master can demote or delete —
  // computed server-side off a hardcoded email, never sent to the client.
  is_protected: boolean;
};
