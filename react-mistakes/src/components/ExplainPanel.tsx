export function ExplainPanel({
  summary,
  wrongCode,
  rightCode,
}: {
  summary: string;
  wrongCode: string;
  rightCode: string;
}) {
  return (
    <div className="explain-body">
      <p>{summary}</p>
      <p className="demo-note">Wrong pattern</p>
      <pre className="code-block">{wrongCode}</pre>
      <p className="demo-note" style={{ marginTop: "1rem" }}>
        Right pattern
      </p>
      <pre className="code-block">{rightCode}</pre>
    </div>
  );
}
