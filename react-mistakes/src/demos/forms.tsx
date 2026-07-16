import { useState } from "react";
import { DemoNote, Metric } from "../components/DemoWidgets";

export function ControlledSwitchWrong() {
  const [enabled, setEnabled] = useState(false);
  const [text, setText] = useState<string | undefined>(undefined);

  return (
    <div>
      <DemoNote>
        Starts uncontrolled (value undefined), then becomes controlled — React
        warns in the console.
      </DemoNote>
      <div className="demo-row">
        <button
          type="button"
          className="demo-btn primary"
          onClick={() => {
            setEnabled(true);
            setText("");
          }}
        >
          Make controlled
        </button>
        <Metric tone="warn">{enabled ? "controlled" : "uncontrolled"}</Metric>
      </div>
      <div className="field">
        <label htmlFor="cu-w">Input</label>
        <input
          id="cu-w"
          value={text as string | undefined}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  );
}

export function ControlledSwitchRight() {
  const [text, setText] = useState("");
  return (
    <div>
      <DemoNote>Always controlled with a string (empty string while blank).</DemoNote>
      <div className="field">
        <label htmlFor="cu-r">Input</label>
        <input id="cu-r" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <Metric tone="ok">value length: {text.length}</Metric>
    </div>
  );
}

export function SemiControlledWrong() {
  const [text, setText] = useState("hello");
  return (
    <div>
      <DemoNote>
        Both defaultValue and value — confusing ownership. Prefer one mode.
      </DemoNote>
      <div className="field">
        <label htmlFor="sc-w">Input</label>
        <input
          id="sc-w"
          defaultValue="hello"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <Metric tone="warn">state: {text}</Metric>
    </div>
  );
}

export function SemiControlledRight() {
  const [text, setText] = useState("hello");
  return (
    <div>
      <DemoNote>Controlled only: value + onChange.</DemoNote>
      <div className="field">
        <label htmlFor="sc-r">Input</label>
        <input id="sc-r" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <Metric tone="ok">state: {text}</Metric>
    </div>
  );
}

export function FormPreventDefaultWrong() {
  const [name, setName] = useState("Ada");
  const [saved, setSaved] = useState("—");

  return (
    <div>
      <DemoNote>
        Submit without preventDefault reloads the page (hash URL may flash) and
        loses in-memory React state.
      </DemoNote>
      <form
        onSubmit={() => {
          setSaved(name);
        }}
      >
        <div className="field">
          <label htmlFor="fp-w">Name</label>
          <input id="fp-w" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit" className="demo-btn primary">
          Save
        </button>
      </form>
      <Metric tone="warn">saved: {saved}</Metric>
    </div>
  );
}

export function FormPreventDefaultRight() {
  const [name, setName] = useState("Ada");
  const [saved, setSaved] = useState("—");

  return (
    <div>
      <DemoNote>preventDefault keeps the SPA state intact.</DemoNote>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(name);
        }}
      >
        <div className="field">
          <label htmlFor="fp-r">Name</label>
          <input id="fp-r" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit" className="demo-btn primary">
          Save
        </button>
      </form>
      <Metric tone="ok">saved: {saved}</Metric>
    </div>
  );
}
