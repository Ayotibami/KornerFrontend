export type AuditEntry = {
  id: number;
  actor_name: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  target_title: string | null;
  metadata: Record<string, string> | null;
  created_at: string;
};

export function auditActionLabel(entry: Pick<AuditEntry, "action" | "target_title" | "metadata">): string {
  const t = entry.target_title ?? "";
  switch (entry.action) {
    case "story.publish":   return `published "${t}"`;
    case "story.unpublish": return `unpublished "${t}"`;
    case "story.approve":   return `approved "${t}"`;
    case "story.delete":    return `deleted "${t}"`;
    case "story.submit":    return `submitted "${t}" for review`;
    case "story.reject": {
      const reason = entry.metadata?.reason;
      return reason ? `rejected "${t}" — ${reason}` : `rejected "${t}"`;
    }
    case "admin.role_change": {
      const role = entry.metadata?.new_role ?? "unknown";
      return `made ${t} a ${role}`;
    }
    case "admin.delete":       return `deleted admin ${t}`;
    case "newsletter.send":    return `sent newsletter "${t}"`;
    case "newsletter.schedule": return `scheduled newsletter "${t}"`;
    case "push.send":          return `sent push "${t}"`;
    case "subscriber.remove":  return `removed subscriber ${t}`;
    default:                   return entry.action;
  }
}

// Returns Tailwind color classes for the action dot and icon
export function auditActionColor(action: string): { dot: string; text: string } {
  if (action === "story.publish" || action === "story.approve") {
    return { dot: "bg-[#22c55e]", text: "text-[#22c55e]" };
  }
  if (action === "story.submit" || action === "newsletter.send" || action === "newsletter.schedule" || action === "push.send") {
    return { dot: "bg-[#3b82f6]", text: "text-[#3b82f6]" };
  }
  if (action === "story.reject" || action === "story.delete" || action === "admin.delete" || action === "story.unpublish") {
    return { dot: "bg-[#ef4444]", text: "text-[#ef4444]" };
  }
  if (action === "subscriber.remove") {
    return { dot: "bg-[#f59e0b]", text: "text-[#f59e0b]" };
  }
  if (action === "admin.role_change") {
    return { dot: "bg-[#7C3AED]", text: "text-[#7C3AED]" };
  }
  return { dot: "bg-gray-400", text: "text-gray-400" };
}
