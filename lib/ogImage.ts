// Link previews (WhatsApp, Facebook, X…) fetch the og:image themselves, and
// WhatsApp quietly shows no image when it is too big (roughly over 300 KB) or
// slow. Covers are uploaded as full-size originals (a 2 MB PNG is common), so
// the preview gets a 1200×630 JPEG made by Cloudinary instead. The cover shown
// on the page itself is not touched.

const CLOUDINARY_UPLOAD = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/.+)$/;

// Cloudinary derives and caches this on first request; f_jpg (not f_auto) so
// every crawler gets a format it understands.
const PREVIEW_TRANSFORM = "c_fill,w_1200,h_630,q_auto:good,f_jpg/";

export function ogImageUrl(url: string): string {
  const match = CLOUDINARY_UPLOAD.exec(url);
  // Not an untransformed Cloudinary upload (another host, a GIF picker link, or
  // a URL that already carries transformations): leave it exactly as it is.
  if (!match) return url;
  return `${match[1]}${PREVIEW_TRANSFORM}${match[2]}`;
}
