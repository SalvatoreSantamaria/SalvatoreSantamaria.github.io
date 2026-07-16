import { useState } from "react";
import { DemoNote, Metric } from "../components/DemoWidgets";

type Item = { id: string; label: string };

const seed: Item[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Bravo" },
  { id: "c", label: "Charlie" },
];

export function MissingKeysWrong() {
  const [items, setItems] = useState(seed);
  return (
    <div>
      <DemoNote>
        Mapping without keys — check the console for React&apos;s key warning when
        the list updates.
      </DemoNote>
      <button
        type="button"
        className="demo-btn primary"
        onClick={() =>
          setItems((list) => [{ id: `n-${list.length}`, label: `New ${list.length}` }, ...list])
        }
      >
        Prepend item
      </button>
      <ul className="item-list">
        {items.map((item) => (
          // intentionally no key
          <li>{item.label}</li>
        ))}
      </ul>
    </div>
  );
}

export function MissingKeysRight() {
  const [items, setItems] = useState(seed);
  return (
    <div>
      <DemoNote>Stable id keys keep reconciliation correct.</DemoNote>
      <button
        type="button"
        className="demo-btn primary"
        onClick={() =>
          setItems((list) => [{ id: `n-${list.length}`, label: `New ${list.length}` }, ...list])
        }
      >
        Prepend item
      </button>
      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </div>
  );
}

function Row({ label }: { label: string }) {
  const [note, setNote] = useState("");
  return (
    <li>
      <strong>{label}</strong>
      <input
        placeholder="type here"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ marginLeft: "0.5rem", flex: 1 }}
      />
    </li>
  );
}

export function IndexAsKeyWrong() {
  const [items, setItems] = useState(seed);
  return (
    <div>
      <DemoNote>
        Type in a row, then Reverse. Index keys leave your text on the wrong item.
      </DemoNote>
      <button
        type="button"
        className="demo-btn primary"
        onClick={() => setItems((list) => [...list].reverse())}
      >
        Reverse
      </button>
      <ul className="item-list">
        {items.map((item, index) => (
          <Row key={index} label={item.label} />
        ))}
      </ul>
    </div>
  );
}

export function IndexAsKeyRight() {
  const [items, setItems] = useState(seed);
  return (
    <div>
      <DemoNote>Id keys keep each row&apos;s local state with the item.</DemoNote>
      <button
        type="button"
        className="demo-btn primary"
        onClick={() => setItems((list) => [...list].reverse())}
      >
        Reverse
      </button>
      <ul className="item-list">
        {items.map((item) => (
          <Row key={item.id} label={item.label} />
        ))}
      </ul>
    </div>
  );
}

export function UnstableKeysWrong() {
  const [tick, setTick] = useState(0);
  const [items] = useState(seed);
  return (
    <div>
      <DemoNote>
        Random keys remount every row on each parent render — focus and input state
        vanish.
      </DemoNote>
      <button type="button" className="demo-btn primary" onClick={() => setTick((t) => t + 1)}>
        Re-render parent ({tick})
      </button>
      <ul className="item-list">
        {items.map((item) => (
          <Row key={Math.random()} label={item.label} />
        ))}
      </ul>
    </div>
  );
}

export function UnstableKeysRight() {
  const [tick, setTick] = useState(0);
  const [items] = useState(seed);
  return (
    <div>
      <DemoNote>Stable keys survive parent re-renders.</DemoNote>
      <button type="button" className="demo-btn primary" onClick={() => setTick((t) => t + 1)}>
        Re-render parent ({tick})
      </button>
      <ul className="item-list">
        {items.map((item) => (
          <Row key={item.id} label={item.label} />
        ))}
      </ul>
    </div>
  );
}

export function KeyOnWrongElementWrong() {
  const [items, setItems] = useState(seed);
  return (
    <div>
      <DemoNote>
        Key sits on an inner span while the outer li has none — React still warns /
        reconciles the list poorly.
      </DemoNote>
      <button
        type="button"
        className="demo-btn"
        onClick={() => setItems((list) => [...list].reverse())}
      >
        Reverse
      </button>
      <ul className="item-list">
        {items.map((item) => (
          <li>
            <span key={item.id}>{item.label}</span>
          </li>
        ))}
      </ul>
      <Metric tone="warn">Check console for key warnings</Metric>
    </div>
  );
}

export function KeyOnWrongElementRight() {
  const [items, setItems] = useState(seed);
  return (
    <div>
      <DemoNote>Key on the outermost element returned from map.</DemoNote>
      <button
        type="button"
        className="demo-btn"
        onClick={() => setItems((list) => [...list].reverse())}
      >
        Reverse
      </button>
      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <Metric tone="ok">Stable list reconciliation</Metric>
    </div>
  );
}
