const BRAND = "#165ABF";

const brandHeader = `
  <div style="text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid #eeeeee;">
    <span style="font-size:22px;font-weight:800;color:${BRAND};letter-spacing:4px;">KORNER</span>
  </div>`;

function wrap(content: string): string {
  return `<div style="background-color:#f0f0f0;padding:32px 8px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <div style="max-width:680px;margin:0 auto;background-color:#ffffff;border-radius:20px;overflow:hidden;padding:40px 36px;">
      ${brandHeader}${content}
    </div>
  </div>`;
}

function coverImg(src: string): string {
  return `<div style="border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.12);margin-bottom:20px;">
    <img src="${src}" alt="Newsletter cover" style="width:100%;height:380px;object-fit:cover;display:block;" />
  </div>`;
}

function previewFooter(): string {
  return `
    <div style="margin-top:48px;padding-top:24px;border-top:1px solid #eeeeee;text-align:center;">
      <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#111;letter-spacing:0.5px;">Korner from Kampos</p>
      <p style="margin:0 0 4px;font-size:12px;color:#aaa;">© 2026 Ayoti. All rights reserved.</p>
      <p style="margin:0 0 12px;font-size:12px;color:#aaa;">Lugbe, Abuja, Nigeria</p>
      <p style="margin:0;font-size:12px;color:#aaa;line-height:1.8;">
        <a href="#" style="color:#aaa;text-decoration:underline;">Privacy Policy</a>
        &nbsp;·&nbsp;
        <a href="mailto:hello@korner.com" style="color:#aaa;text-decoration:underline;">hello@korner.com</a>
      </p>
      <p style="margin:12px 0 0;font-size:12px;color:#aaa;line-height:1.8;">
        You're receiving this because you subscribed to KornerEffect.&nbsp;
        <a href="#" style="color:${BRAND};text-decoration:underline;">Unsubscribe</a>
      </p>
    </div>`;
}

function withSampleName(html: string): string {
  return html.replace(/\{\{name\}\}/g, "Chisom");
}

export function buildNewsletterPreview(
  subject: string,
  body: string,
  imageUrl?: string | null,
): string {
  const img = imageUrl ? coverImg(imageUrl) : "";
  const subjectEl = `<p style="margin:0 0 8px;font-size:26px;font-weight:700;color:${BRAND};line-height:1.3;">${subject || "(no subject)"}</p>`;
  const bodyEl = `<div style="font-size:16px;color:#444;line-height:1.9;word-spacing:0.3px;margin-top:16px;">${body}</div>`;
  const content = `${img}${subjectEl}${bodyEl}${previewFooter()}`;
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;">${withSampleName(wrap(content))}</body></html>`;
}

export function buildStoryMailPreview(subject: string, body: string): string {
  const subjectEl = `<p style="margin:0 0 8px;font-size:26px;font-weight:700;color:${BRAND};line-height:1.3;">${subject || "(no subject)"}</p>`;
  const bodyEl = `<div style="font-size:16px;color:#444;line-height:1.9;word-spacing:0.3px;margin-top:16px;">${body}</div>`;
  const note = `<div style="margin-top:24px;padding:12px 16px;background-color:#f8f9fb;border-radius:10px;border-left:3px solid #93b8f0;">
    <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">The story's cover image and a "Read now" link are added automatically when this mail is sent.</p>
  </div>`;
  const content = `${subjectEl}${bodyEl}${note}${previewFooter()}`;
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;">${withSampleName(wrap(content))}</body></html>`;
}
