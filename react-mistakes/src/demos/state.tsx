import { useEffect, useRef, useState } from "react";
import { DemoNote, Metric } from "../components/DemoWidgets";

export function MutatingStateWrong() {
  const [items, setItems] = useState<string[]>(["alpha", "beta"]);
  const [ticks, setTicks] = useState(0);

  return (
    <div>
      <DemoNote>
        Mutating the array then calling setItems with the same reference often
        skips a re-render. Use Force tick to prove the data changed in memory.
      </DemoNote>
      <div className="demo-row">
        <button
          type="button"
          className="demo-btn primary"
          onClick={() => {
            items.push(`item-${items.length}`);
            setItems(items);
          }}
        >
          Add (mutate)
        </button>
        <button type="button" className="demo-btn" onClick={() => setTicks((t) => t + 1)}>
          Force tick
        </button>
        <Metric tone="warn">ticks: {ticks}</Metric>
        <Metric>memory length: {items.length}</Metric>
      </div>
      <ul className="item-list">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function MutatingStateRight() {
  const [items, setItems] = useState<string[]>(["alpha", "beta"]);
  return (
    <div>
      <DemoNote>Immutable copy updates the UI immediately.</DemoNote>
      <div className="demo-row">
        <button
          type="button"
          className="demo-btn primary"
          onClick={() => setItems((prev) => [...prev, `item-${prev.length}`])}
        >
          Add (immutable)
        </button>
        <Metric tone="ok">length: {items.length}</Metric>
      </div>
      <ul className="item-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="item-list">
      {tags.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export function MutatingPropsWrong() {
  const [tags] = useState(["react", "hooks"]);
  return (
    <div>
      <DemoNote>
        Child mutates the props array. Parent still holds the mutated data —
        surprising for everyone above.
      </DemoNote>
      <button
        type="button"
        className="demo-btn primary"
        onClick={() => {
          // anti-pattern: mutate props-like data passed down
          tags.push(`mutated-${tags.length}`);
        }}
      >
        Child: mutate props
      </button>
      <p className="demo-note">Open the console and log — length grows without a clean update path.</p>
      <TagList tags={tags} />
      <button type="button" className="demo-btn" onClick={() => alert(tags.join(", "))}>
        Alert current tags
      </button>
    </div>
  );
}

export function MutatingPropsRight() {
  const [tags, setTags] = useState(["react", "hooks"]);
  return (
    <div>
      <DemoNote>Parent owns updates; child asks via callback (here: button in parent).</DemoNote>
      <button
        type="button"
        className="demo-btn primary"
        onClick={() => setTags((t) => [...t, `tag-${t.length}`])}
      >
        Add tag immutably
      </button>
      <TagList tags={tags} />
    </div>
  );
}

export function DerivedStateWrong() {
  const [first, setFirst] = useState("Ada");
  const [last, setLast] = useState("Lovelace");
  const [fullName, setFullName] = useState("Ada Lovelace");

  useEffect(() => {
    setFullName(`${first} ${last}`);
  }, [first, last]);

  return (
    <div>
      <DemoNote>
        fullName is stored separately and synced with an effect — extra render and
        easy to drift if someone forgets a field.
      </DemoNote>
      <div className="field">
        <label htmlFor="df">First</label>
        <input id="df" value={first} onChange={(e) => setFirst(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="dl">Last</label>
        <input id="dl" value={last} onChange={(e) => setLast(e.target.value)} />
      </div>
      <Metric tone="warn">stored fullName: {fullName}</Metric>
    </div>
  );
}

export function DerivedStateRight() {
  const [first, setFirst] = useState("Ada");
  const [last, setLast] = useState("Lovelace");
  const fullName = `${first} ${last}`;

  return (
    <div>
      <DemoNote>Derived during render — always in sync.</DemoNote>
      <div className="field">
        <label htmlFor="rf">First</label>
        <input id="rf" value={first} onChange={(e) => setFirst(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="rl">Last</label>
        <input id="rl" value={last} onChange={(e) => setLast(e.target.value)} />
      </div>
      <Metric tone="ok">computed fullName: {fullName}</Metric>
    </div>
  );
}

let renderFetchCount = 0;

export function SideEffectsInRenderWrong() {
  const [query, setQuery] = useState("react");
  const [hits, setHits] = useState(0);
  // Anti-pattern: side effect during render (guarded count only)
  renderFetchCount += 1;
  if (hits !== renderFetchCount) {
    // simulate scheduling work during render
    queueMicrotask(() => setHits(renderFetchCount));
  }

  return (
    <div>
      <DemoNote>
        Touching external work / setState from render (here via microtask) fights
        React&apos;s purity model. Typing retriggers the side channel.
      </DemoNote>
      <div className="field">
        <label htmlFor="q1">Query</label>
        <input id="q1" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <Metric tone="warn">side-channel runs: {hits}</Metric>
    </div>
  );
}

export function SideEffectsInRenderRight() {
  const [query, setQuery] = useState("react");
  const [hits, setHits] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (!cancelled) setHits((h) => h + 1);
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query]);

  return (
    <div>
      <DemoNote>Synchronize in an effect with cleanup — render stays pure.</DemoNote>
      <div className="field">
        <label htmlFor="q2">Query</label>
        <input id="q2" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <Metric tone="ok">effect runs (debounced): {hits}</Metric>
    </div>
  );
}

export function SetStateInRenderWrong() {
  const [n, setN] = useState(0);
  const [guard] = useState(() => ({ stopped: false }));

  if (n < 25 && !guard.stopped) {
    // limited so the tab does not freeze
    setN(n + 1);
  }

  return (
    <div>
      <DemoNote>
        Unconditional setState during render retriggers render. This demo caps at
        25 so the browser stays usable — production loops are worse.
      </DemoNote>
      <Metric tone="warn">n climbed to {n} during render</Metric>
      <button
        type="button"
        className="demo-btn"
        onClick={() => {
          guard.stopped = false;
          setN(0);
        }}
      >
        Reset
      </button>
    </div>
  );
}

export function SetStateInRenderRight() {
  const [n, setN] = useState(0);
  return (
    <div>
      <DemoNote>Updates happen in response to events.</DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn primary" onClick={() => setN((x) => x + 1)}>
          Increment
        </button>
        <Metric tone="ok">n: {n}</Metric>
      </div>
    </div>
  );
}

export function ImpureRenderWrong() {
  const [label, setLabel] = useState("roll");
  const noise = Math.random().toFixed(4);

  return (
    <div>
      <DemoNote>
        Math.random() during render changes every paint — Strict Mode double-render
        makes this especially obvious.
      </DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setLabel((l) => l + "!")}>
          Re-render
        </button>
        <Metric tone="warn">random in render: {noise}</Metric>
        <Metric>{label}</Metric>
      </div>
    </div>
  );
}

export function ImpureRenderRight() {
  const [label, setLabel] = useState("roll");
  const [noise, setNoise] = useState(() => Math.random().toFixed(4));

  return (
    <div>
      <DemoNote>Capture impure values in state/events so render is deterministic.</DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setLabel((l) => l + "!")}>
          Re-render
        </button>
        <button
          type="button"
          className="demo-btn primary"
          onClick={() => setNoise(Math.random().toFixed(4))}
        >
          New roll
        </button>
        <Metric tone="ok">stored: {noise}</Metric>
        <Metric>{label}</Metric>
      </div>
    </div>
  );
}

export function StateVsRefWrong() {
  const [keystrokes, setKeystrokes] = useState(0);
  const [text, setText] = useState("");

  return (
    <div>
      <DemoNote>
        Tracking every keystroke in state re-renders the whole tree even if you
        only needed a count for submit logging.
      </DemoNote>
      <div className="field">
        <label htmlFor="sv1">Notes</label>
        <input
          id="sv1"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setKeystrokes((k) => k + 1);
          }}
        />
      </div>
      <Metric tone="warn">re-renders driven by keystroke state: {keystrokes}</Metric>
    </div>
  );
}

export function StateVsRefRight() {
  const [text, setText] = useState("");
  const keystrokes = useRef(0);
  const [logged, setLogged] = useState(0);

  return (
    <div>
      <DemoNote>Ref tracks keystrokes without extra renders; read it when you need it.</DemoNote>
      <div className="field">
        <label htmlFor="sv2">Notes</label>
        <input
          id="sv2"
          value={text}
          onChange={(e) => {
            keystrokes.current += 1;
            setText(e.target.value);
          }}
        />
      </div>
      <div className="demo-row">
        <button
          type="button"
          className="demo-btn primary"
          onClick={() => setLogged(keystrokes.current)}
        >
          Log keystrokes
        </button>
        <Metric tone="ok">last logged: {logged}</Metric>
      </div>
    </div>
  );
}

function Editor({ userId }: { userId: string }) {
  const [draft, setDraft] = useState(`Draft for ${userId}`);
  return (
    <div className="field">
      <label htmlFor={`ed-${userId}`}>Draft</label>
      <input id={`ed-${userId}`} value={draft} onChange={(e) => setDraft(e.target.value)} />
      <Metric>userId: {userId}</Metric>
    </div>
  );
}

export function ResetStateWrong() {
  const [userId, setUserId] = useState("u1");
  return (
    <div>
      <DemoNote>
        Switching users without remounting leaves the previous draft text in local
        state.
      </DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setUserId("u1")}>
          User u1
        </button>
        <button type="button" className="demo-btn" onClick={() => setUserId("u2")}>
          User u2
        </button>
      </div>
      <Editor userId={userId} />
    </div>
  );
}

export function ResetStateRight() {
  const [userId, setUserId] = useState("u1");
  return (
    <div>
      <DemoNote>
        key={"{userId}"} remounts the editor so initial state resets with the entity.
      </DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setUserId("u1")}>
          User u1
        </button>
        <button type="button" className="demo-btn" onClick={() => setUserId("u2")}>
          User u2
        </button>
      </div>
      <Editor key={userId} userId={userId} />
    </div>
  );
}
