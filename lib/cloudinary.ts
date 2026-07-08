// Cloudinary project identifiers.
// UPLOAD_PRESET must be set to "Unsigned" in the Cloudinary dashboard so the
// browser can upload directly without a server-side signed URL.
const CLOUD_NAME = "dbyxdhnjb";
const UPLOAD_PRESET = "wh6vvgfv";

// Uploads a file directly to Cloudinary from the browser.
// Returns both the secure CDN URL and the public_id needed for server-side deletion.
// Throws on failure — callers must catch and handle.
export async function uploadToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    throw new Error(`Cloudinary upload failed (${res.status})`);
  }

  const data = await res.json();

  if (!data.secure_url || !data.public_id) {
    throw new Error("Cloudinary returned incomplete data");
  }

  return { url: data.secure_url as string, publicId: data.public_id as string };
}
