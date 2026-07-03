// Page-specific title + subtitle shown in the form panel.
// The logo / app name now lives in AuthCard's left brand panel on desktop
// and the mobile mini-header — this component only handles the per-page copy.

export default function AuthBranding({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="text-2xl font-bold text-[#0f1e3d] dark:text-gray-50 leading-tight">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{subtitle}</p>
    </div>
  );
}
