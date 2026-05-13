import { cookies } from "next/headers";

const getProfile = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || "";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/profile`,
      {
        method: "GET",
        headers: {
          Cookie: `session=${token}`,
        },
      },
    );
    const { profile } = await res.json();
    return profile;
  } catch (error) {
    console.log(error);
  }
};

export default getProfile;
