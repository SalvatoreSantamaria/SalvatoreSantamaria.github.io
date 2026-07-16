import type { MistakeMode } from "../lib/mistakes";

export function StatusBadge({ mode }: { mode: MistakeMode }) {
  return (
    <span className={`badge ${mode}`}>{mode === "live" ? "Live" : "Explain"}</span>
  );
}
