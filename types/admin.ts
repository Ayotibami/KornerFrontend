// Shape of the admin profile returned by GET /admin/profile.
// Used in the Navbar to show the admin's name and avatar.
export type AdminProfile = {
  admin_name: string;
  email: string;
  avatar_url?: string;  // Optional — admin may not have uploaded a profile picture yet
  bio?: string | null;  // Not yet returned by the API — placeholder for when it is
};
