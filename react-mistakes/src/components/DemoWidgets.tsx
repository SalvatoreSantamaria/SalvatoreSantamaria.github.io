export function DemoNote({ children }: { children: React.ReactNode }) {
  return <p className="demo-note">{children}</p>;
}

export function Metric({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "warn" | "ok";
}) {
  const cls = tone === "neutral" ? "metric" : `metric ${tone}`;
  return <span className={cls}>{children}</span>;
}
