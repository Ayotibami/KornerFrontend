import { fetchWithAuth } from "@/lib/fetchWithAuth";

const getProfile = async () => {
  try {
    const res = await fetchWithAuth("/admin/profile");
    const { profile } = await res.json();
    return profile;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }
};

export default getProfile;
