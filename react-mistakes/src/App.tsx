import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MistakePage } from "./pages/MistakePage";

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <header className="app-nav">
          <Link to="/" className="brand">
            React Anti-Patterns
          </Link>
          <a href="../../index.html">
            Back to resume
          </a>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mistakes/:slug" element={<MistakePage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
