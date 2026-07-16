/** Short note for explanation-only mistakes; code lives in MistakeShell. */
export function ExplainPanel({ summary }: { summary: string }) {
  return (
    <div className="explain-body">
      <p>{summary}</p>
      <p className="demo-note">
        Toggle Wrong / Right above to compare the annotated code samples.
      </p>
    </div>
  );
}
