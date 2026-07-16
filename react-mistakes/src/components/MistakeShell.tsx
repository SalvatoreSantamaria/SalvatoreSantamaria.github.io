import { useSearchParams, Link } from "react-router-dom";
import { getCategory, type Mistake } from "../lib/mistakes";
import { snippets } from "../lib/snippets";
import { StatusBadge } from "./StatusBadge";

type Props = {
  mistake: Mistake;
  wrong: React.ReactNode;
  right: React.ReactNode;
};

export function MistakeShell({ mistake, wrong, right }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "right" ? "right" : "wrong";
  const category = getCategory(mistake.category);
  const sample = snippets[mistake.slug];
  const code = sample ? (mode === "wrong" ? sample.wrong : sample.right) : null;

  function setMode(next: "wrong" | "right") {
    const params = new URLSearchParams(searchParams);
    params.set("mode", next);
    setSearchParams(params, { replace: true });
  }

  return (
    <article>
      <p style={{ marginBottom: "1rem" }}>
        <Link to="/">← All mistakes</Link>
      </p>
      <header className="shell-header">
        <div className="shell-meta">
          {category && <span className="chip">{category.label}</span>}
          <StatusBadge mode={mistake.mode} />
        </div>
        <h1>{mistake.title}</h1>
        <div className="problem-solution">
          <div className="panel wrong">
            <p className="label">Problem</p>
            <p>{mistake.problem}</p>
          </div>
          <div className="panel right">
            <p className="label">Solution</p>
            <p>{mistake.solution}</p>
          </div>
        </div>
      </header>

      <div className="mode-toggle">
        <button
          type="button"
          className={mode === "wrong" ? "active" : undefined}
          onClick={() => setMode("wrong")}
        >
          Wrong way
        </button>
        <button
          type="button"
          className={mode === "right" ? "active" : undefined}
          onClick={() => setMode("right")}
        >
          Right way
        </button>
      </div>

      <div className="demo-stage">{mode === "wrong" ? wrong : right}</div>

      {code && (
        <section className="code-section">
          <div className="code-section-header">
            <p className="label">{mode === "wrong" ? "Wrong code" : "Right code"}</p>
            <p className="demo-note" style={{ margin: 0 }}>
              Comments explain why this is {mode === "wrong" ? "wrong" : "right"}.
            </p>
          </div>
          <pre className="code-block">{code}</pre>
        </section>
      )}
    </article>
  );
}
