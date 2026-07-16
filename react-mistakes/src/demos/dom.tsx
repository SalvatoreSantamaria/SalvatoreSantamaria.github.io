import { useRef, useState } from "react";
import { DemoNote, Metric } from "../components/DemoWidgets";

export function DirectDomWrong() {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <DemoNote>
        Imperative querySelector updates fight React — a later re-render can wipe
        them.
      </DemoNote>
      <div ref={wrapRef}>
        <p id="dom-target">Hello</p>
      </div>
      <div className="demo-row">
        <button
          type="button"
          className="demo-btn primary"
          onClick={() => {
            const el = document.querySelector("#dom-target");
            if (el) el.textContent = `Imperative ${Date.now()}`;
          }}
        >
          Mutate DOM
        </button>
        <button
          type="button"
          className="demo-btn"
          onClick={() => {
            // force React re-render of parent by remounting text via state elsewhere
            wrapRef.current?.setAttribute("data-tick", String(Date.now()));
            const el = document.querySelector("#dom-target");
            // simulate react ownership reclaim by resetting from "source"
            if (el) el.textContent = "Hello";
          }}
        >
          Simulate React reset
        </button>
      </div>
      <Metric tone="warn">UI source of truth is unclear</Metric>
    </div>
  );
}

export function DirectDomRight() {
  const [text, setText] = useState("Hello");
  return (
    <div>
      <DemoNote>State owns the text — one source of truth.</DemoNote>
      <p>{text}</p>
      <button
        type="button"
        className="demo-btn primary"
        onClick={() => setText(`State ${Date.now()}`)}
      >
        Update state
      </button>
      <Metric tone="ok">{text}</Metric>
    </div>
  );
}

export function UnsafeInnerHtmlWrong() {
  const [html, setHtml] = useState(`<img src=x onerror="console.log('xss-demo')">Hello`);

  return (
    <div>
      <DemoNote>
        Untrusted HTML via dangerouslySetInnerHTML is an XSS footgun. This sample
        only logs to console (still unsafe pattern).
      </DemoNote>
      <div className="field">
        <label htmlFor="html-w">HTML</label>
        <textarea id="html-w" rows={3} value={html} onChange={(e) => setHtml(e.target.value)} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Metric tone="warn">Never pipe unsanitized user HTML</Metric>
    </div>
  );
}

export function UnsafeInnerHtmlRight() {
  const [text, setText] = useState(`<b>not bold — escaped</b>`);
  return (
    <div>
      <DemoNote>Prefer text rendering (automatic escaping). Sanitize if HTML is required.</DemoNote>
      <div className="field">
        <label htmlFor="html-r">Text</label>
        <textarea id="html-r" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div>{text}</div>
      <Metric tone="ok">Rendered as text</Metric>
    </div>
  );
}

export function ClickableDivWrong() {
  const [n, setN] = useState(0);
  return (
    <div>
      <DemoNote>
        Try activating with keyboard only — a naked clickable div is not reachable /
        operable like a button.
      </DemoNote>
      <div
        className="demo-btn primary"
        onClick={() => setN((x) => x + 1)}
        style={{ display: "inline-block" }}
      >
        Div click target
      </div>
      <Metric tone="warn">clicks: {n}</Metric>
    </div>
  );
}

export function ClickableDivRight() {
  const [n, setN] = useState(0);
  return (
    <div>
      <DemoNote>
        Real button — focusable, Space/Enter activate, correct role for AT.
      </DemoNote>
      <button type="button" className="demo-btn primary" onClick={() => setN((x) => x + 1)}>
        Button click target
      </button>
      <Metric tone="ok">clicks: {n}</Metric>
    </div>
  );
}

export function BrokenLabelWrong() {
  const [v, setV] = useState("");
  return (
    <div>
      <DemoNote>
        Visible text is not associated — clicking the text does not focus the
        input.
      </DemoNote>
      <p>Email</p>
      <input value={v} onChange={(e) => setV(e.target.value)} />
      <Metric tone="warn">No htmlFor / id pairing</Metric>
    </div>
  );
}

export function BrokenLabelRight() {
  const [v, setV] = useState("");
  return (
    <div>
      <DemoNote>htmlFor matches id — click the label to focus.</DemoNote>
      <div className="field">
        <label htmlFor="email-ok">Email</label>
        <input id="email-ok" value={v} onChange={(e) => setV(e.target.value)} />
      </div>
      <Metric tone="ok">Associated label</Metric>
    </div>
  );
}
