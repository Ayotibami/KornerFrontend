// Cloudinary project identifiers.
// UPLOAD_PRESET must be set to "Unsigned" in the Cloudinary dashboard so the
// browser can upload directly without a server-side signed URL.
const CLOUD_NAME = "dbyxdhnjb";
const UPLOAD_PRESET = "wh6vvgfv";

// Uploads a file directly to Cloudinary from the browser and returns the secure CDN URL.
//
// Called from: CoverImage, ImageUploader (story blocks), and AvatarPicker.
// All three follow the same upload pattern:
//   1. Show an optimistic local blob preview immediately for fast feedback.
//   2. Upload in the background — increment uploadingCount so the save button stays disabled.
//   3. On success: update state with the permanent Cloudinary URL.
//   4. On failure: revert the preview and show a toast.
//   5. In `finally`: always decrement uploadingCount so the save button re-enables.
//
// Throws on failure — callers must catch and handle.
export async function uploadToCloudinary(file: File): Promise<string> {
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

  if (!data.secure_url) {
    throw new Error("Cloudinary returned no URL");
  }

  return data.secure_url as string;
}
