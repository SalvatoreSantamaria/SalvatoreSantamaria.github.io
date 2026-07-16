import { Link } from "react-router-dom";
import { getMistakesByCategory, mistakes } from "../lib/mistakes";
import { StatusBadge } from "../components/StatusBadge";

export function HomePage() {
  const live = mistakes.filter((m) => m.mode === "live").length;
  const explain = mistakes.filter((m) => m.mode === "explain").length;
  const grouped = getMistakesByCategory();

  return (
    <div>
      <p className="eyebrow">Client React cheatsheet</p>
      <h1>React Anti-Patterns Playground</h1>
      <p className="lead">
        {mistakes.length} common client React mistakes across {grouped.length}{" "}
        categories. Toggle each page between the wrong way and the right way.{" "}
        {live} live demos run in the browser; {explain} are explanation-only with
        code samples.
      </p>

      {grouped.map(({ category, items }) => (
        <section key={category.id} className="category-block">
          <h2>{category.label}</h2>
          <p className="category-desc">{category.description}</p>
          <ol className="mistake-list">
            {items.map((m) => (
              <li key={m.slug}>
                <Link to={`/mistakes/${m.slug}`} className="mistake-link">
                  <span className="title">
                    {m.id}. {m.title}
                  </span>
                  <StatusBadge mode={m.mode} />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
