import type { ReactNode } from "react";
import { Info, AlertCircle } from "lucide-react";

export function Section({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-6 flex flex-col gap-5"
    >
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="w-9 h-9 rounded-xl bg-secondary dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h2 className="font-extrabold text-base text-[#0f1e3d] dark:text-gray-50">{title}</h2>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{children}</p>
  );
}

export function Sub({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-bold text-sm text-[#0f1e3d] dark:text-gray-100 mt-1">{children}</h3>
  );
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 items-start bg-blue-50 dark:bg-[#1e3a5f]/20 border border-blue-100 dark:border-[#1e3a5f] rounded-xl p-4">
      <Info size={14} className="text-blue-500 dark:text-[#93b8f0] flex-shrink-0 mt-0.5" />
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{children}</p>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 items-start bg-amber-50 dark:bg-[#422006]/20 border border-amber-100 dark:border-[#422006] rounded-xl p-4">
      <AlertCircle size={14} className="text-amber-500 dark:text-[#FDE68A] flex-shrink-0 mt-0.5" />
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{children}</p>
    </div>
  );
}

export function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="w-5 h-5 rounded-full bg-primary/10 dark:bg-[#1e3a5f] text-primary dark:text-[#93b8f0] text-[10px] font-bold flex-shrink-0 flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 items-start">
          <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-[#93b8f0] flex-shrink-0 mt-2 opacity-70" />
          <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function BlockCard({
  icon,
  name,
  description,
  usage,
}: {
  icon: ReactNode;
  name: string;
  description: ReactNode;
  usage?: string;
}) {
  return (
    <div className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
      <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-100 dark:border-white/[0.06] flex items-center justify-center flex-shrink-0 text-primary dark:text-[#93b8f0]">
        {icon}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">{name}</p>
        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{description}</div>
        {usage && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">Best for: {usage}</p>
        )}
      </div>
    </div>
  );
}

export function ActionRow({
  colorClass,
  icon,
  label,
  description,
}: {
  colorClass: string;
  icon: ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 items-start p-3.5 bg-gray-50 dark:bg-[#1e2130] rounded-xl border border-gray-100 dark:border-white/[0.04]">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-[#0f1e3d] dark:text-gray-50">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function StatusRow({
  label,
  colorClass,
  badgeClass,
  description,
}: {
  label: string;
  colorClass: string;
  badgeClass: string;
  description: string;
}) {
  return (
    <div className={`flex gap-3 items-start p-4 rounded-xl border ${colorClass}`}>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 mt-0.5 ${badgeClass}`}>
        {label}
      </span>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}
