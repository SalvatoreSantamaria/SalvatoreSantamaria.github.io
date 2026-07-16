import { Link, useParams } from "react-router-dom";
import { getMistake } from "../lib/mistakes";
import { getDemo } from "../lib/registry";
import { MistakeShell } from "../components/MistakeShell";

export function MistakePage() {
  const { slug = "" } = useParams();
  const mistake = getMistake(slug);
  const demo = getDemo(slug);

  if (!mistake || !demo) {
    return (
      <div>
        <p>
          <Link to="/">← All mistakes</Link>
        </p>
        <h1>Not found</h1>
        <p className="lead">No mistake registered for “{slug}”.</p>
      </div>
    );
  }

  return <MistakeShell mistake={mistake} wrong={demo.wrong} right={demo.right} />;
}
