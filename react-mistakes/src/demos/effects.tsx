import { useCallback, useEffect, useState } from "react";
import { DemoNote, Metric } from "../components/DemoWidgets";

function fakeFetch(id: string, ms: number): Promise<string> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(`Result for ${id} (${ms}ms)`), ms);
  });
}

export function MissingEffectDepsWrong() {
  const [userId, setUserId] = useState("ada");
  const [label, setLabel] = useState("");

  useEffect(() => {
    setLabel(`Loaded profile for ${userId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional anti-pattern
  }, []);

  return (
    <div>
      <DemoNote>
        Effect runs once with the initial userId. Changing the user does not refresh
        the label (stale closure / missing dep).
      </DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setUserId("ada")}>
          ada
        </button>
        <button type="button" className="demo-btn" onClick={() => setUserId("grace")}>
          grace
        </button>
        <Metric>userId state: {userId}</Metric>
        <Metric tone="warn">{label}</Metric>
      </div>
    </div>
  );
}

export function MissingEffectDepsRight() {
  const [userId, setUserId] = useState("ada");
  const [label, setLabel] = useState("");

  useEffect(() => {
    setLabel(`Loaded profile for ${userId}`);
  }, [userId]);

  return (
    <div>
      <DemoNote>userId is a dependency — label stays in sync.</DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setUserId("ada")}>
          ada
        </button>
        <button type="button" className="demo-btn" onClick={() => setUserId("grace")}>
          grace
        </button>
        <Metric>userId state: {userId}</Metric>
        <Metric tone="ok">{label}</Metric>
      </div>
    </div>
  );
}

export function InfiniteEffectLoopWrong() {
  const [count, setCount] = useState(0);
  const [capped, setCapped] = useState(false);

  useEffect(() => {
    if (count >= 40) {
      setCapped(true);
      return;
    }
    setCount((c) => c + 1);
  }, [count]);

  return (
    <div>
      <DemoNote>
        Effect setStates a value it depends on → loop. Capped at 40 for safety.
      </DemoNote>
      <Metric tone="warn">count: {count}{capped ? " (capped)" : ""}</Metric>
      <button
        type="button"
        className="demo-btn"
        onClick={() => {
          setCapped(false);
          setCount(0);
        }}
      >
        Reset
      </button>
    </div>
  );
}

export function InfiniteEffectLoopRight() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <DemoNote>No effect needed — update from the event.</DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn primary" onClick={() => setCount((c) => c + 1)}>
          Increment
        </button>
        <Metric tone="ok">count: {count}</Metric>
      </div>
    </div>
  );
}

export function FetchWithoutCancelWrong() {
  const [id, setId] = useState("slow");
  const [result, setResult] = useState("—");

  useEffect(() => {
    const ms = id === "slow" ? 1200 : 200;
    void fakeFetch(id, ms).then((text) => setResult(text));
  }, [id]);

  return (
    <div>
      <DemoNote>
        Click Fast then Slow quickly — a late slow response can overwrite the fast
        one (race).
      </DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setId("slow")}>
          Slow
        </button>
        <button type="button" className="demo-btn primary" onClick={() => setId("fast")}>
          Fast
        </button>
        <Metric tone="warn">{result}</Metric>
      </div>
    </div>
  );
}

export function FetchWithoutCancelRight() {
  const [id, setId] = useState("slow");
  const [result, setResult] = useState("—");

  useEffect(() => {
    let ignore = false;
    const ms = id === "slow" ? 1200 : 200;
    void fakeFetch(id, ms).then((text) => {
      if (!ignore) setResult(text);
    });
    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div>
      <DemoNote>Cleanup ignore flag drops stale responses.</DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setId("slow")}>
          Slow
        </button>
        <button type="button" className="demo-btn primary" onClick={() => setId("fast")}>
          Fast
        </button>
        <Metric tone="ok">{result}</Metric>
      </div>
    </div>
  );
}

export function MissingCleanupWrong() {
  const [show, setShow] = useState(true);
  const [ticks, setTicks] = useState(0);
  const onTick = useCallback(() => setTicks((t) => t + 1), []);

  return (
    <div>
      <DemoNote>
        Mount the ticker, then Unmount — without cleanup the interval keeps firing
        (watch the counter).
      </DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setShow((s) => !s)}>
          {show ? "Unmount ticker" : "Mount ticker"}
        </button>
        <Metric>external ticks seen: {ticks}</Metric>
      </div>
      {show && <LeakyTicker onTick={onTick} />}
    </div>
  );
}

function LeakyTicker({ onTick }: { onTick: () => void }) {
  useEffect(() => {
    const id = window.setInterval(onTick, 500);
    // intentional: no cleanup
    void id;
  }, [onTick]);
  return <Metric tone="warn">Ticker mounted (leaky)</Metric>;
}

export function MissingCleanupRight() {
  const [show, setShow] = useState(true);
  const [ticks, setTicks] = useState(0);
  const onTick = useCallback(() => setTicks((t) => t + 1), []);

  return (
    <div>
      <DemoNote>Cleanup clears the interval on unmount — ticks stop.</DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setShow((s) => !s)}>
          {show ? "Unmount ticker" : "Mount ticker"}
        </button>
        <Metric>ticks: {ticks}</Metric>
      </div>
      {show && <SafeTicker onTick={onTick} />}
    </div>
  );
}

function SafeTicker({ onTick }: { onTick: () => void }) {
  useEffect(() => {
    const id = window.setInterval(onTick, 500);
    return () => clearInterval(id);
  }, [onTick]);
  return <Metric tone="ok">Ticker mounted (cleaned up)</Metric>;
}

export function EffectForDerivedWrong() {
  const [items, setItems] = useState([1, 2, 3, 4]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(items.reduce((a, b) => a + b, 0));
  }, [items]);

  return (
    <div>
      <DemoNote>Effect syncs a value you could compute in render — extra pass.</DemoNote>
      <button
        type="button"
        className="demo-btn"
        onClick={() => setItems((xs) => [...xs, xs.length + 1])}
      >
        Add number
      </button>
      <Metric tone="warn">effect total: {total}</Metric>
    </div>
  );
}

export function EffectForDerivedRight() {
  const [items, setItems] = useState([1, 2, 3, 4]);
  const total = items.reduce((a, b) => a + b, 0);

  return (
    <div>
      <DemoNote>Derive during render.</DemoNote>
      <button
        type="button"
        className="demo-btn"
        onClick={() => setItems((xs) => [...xs, xs.length + 1])}
      >
        Add number
      </button>
      <Metric tone="ok">render total: {total}</Metric>
    </div>
  );
}

export function EffectForEventsWrong() {
  const [pending, setPending] = useState(false);
  const [log, setLog] = useState("—");

  useEffect(() => {
    if (!pending) return;
    setLog(`Saved at ${new Date().toLocaleTimeString()}`);
    setPending(false);
  }, [pending]);

  return (
    <div>
      <DemoNote>
        Click sets a flag; an effect performs the real work — indirect and easy to
        race.
      </DemoNote>
      <button type="button" className="demo-btn primary" onClick={() => setPending(true)}>
        Save
      </button>
      <Metric tone="warn">{log}</Metric>
    </div>
  );
}

export function EffectForEventsRight() {
  const [log, setLog] = useState("—");

  return (
    <div>
      <DemoNote>Do the work in the event handler.</DemoNote>
      <button
        type="button"
        className="demo-btn primary"
        onClick={() => setLog(`Saved at ${new Date().toLocaleTimeString()}`)}
      >
        Save
      </button>
      <Metric tone="ok">{log}</Metric>
    </div>
  );
}

export function SyncPropsToStateWrong() {
  const [userId, setUserId] = useState("ada");
  return (
    <div>
      <DemoNote>
        Child copies prop into state via effect — edit the field, switch users, watch
        flicker/extra renders.
      </DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setUserId("ada")}>
          ada
        </button>
        <button type="button" className="demo-btn" onClick={() => setUserId("grace")}>
          grace
        </button>
      </div>
      <SyncedChild name={userId} />
    </div>
  );
}

function SyncedChild({ name }: { name: string }) {
  const [value, setValue] = useState(name);
  useEffect(() => {
    setValue(name);
  }, [name]);
  return (
    <div className="field">
      <label htmlFor="sc">Local copy</label>
      <input id="sc" value={value} onChange={(e) => setValue(e.target.value)} />
      <Metric tone="warn">prop: {name}</Metric>
    </div>
  );
}

export function SyncPropsToStateRight() {
  const [userId, setUserId] = useState("ada");
  return (
    <div>
      <DemoNote>Remount with key when the entity changes — fresh local state.</DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setUserId("ada")}>
          ada
        </button>
        <button type="button" className="demo-btn" onClick={() => setUserId("grace")}>
          grace
        </button>
      </div>
      <LocalChild key={userId} name={userId} />
    </div>
  );
}

function LocalChild({ name }: { name: string }) {
  const [value, setValue] = useState(name);
  return (
    <div className="field">
      <label htmlFor="lc">Local draft</label>
      <input id="lc" value={value} onChange={(e) => setValue(e.target.value)} />
      <Metric tone="ok">started as: {name}</Metric>
    </div>
  );
}
