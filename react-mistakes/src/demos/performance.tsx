import {
  createContext,
  memo,
  useContext,
  useDeferredValue,
  useMemo,
  useState,
} from "react";
import { DemoNote, Metric } from "../components/DemoWidgets";

type Ctx = { n: number; setN: (n: number) => void };

const UnstableCtx = createContext<Ctx>({ n: 0, setN: () => undefined });
const StableCtx = createContext<Ctx>({ n: 0, setN: () => undefined });

const UnstableConsumer = memo(function UnstableConsumer() {
  const { n } = useContext(UnstableCtx);
  const countRef = useMemo(() => ({ current: 0 }), []);
  countRef.current += 1;
  return (
    <Metric>
      unstable consumer sees n={n}, renders={countRef.current}
    </Metric>
  );
});

const StableConsumer = memo(function StableConsumer() {
  const { n } = useContext(StableCtx);
  const countRef = useMemo(() => ({ current: 0 }), []);
  countRef.current += 1;
  return (
    <Metric>
      stable consumer sees n={n}, renders={countRef.current}
    </Metric>
  );
});

export function ContextIdentityWrong() {
  const [n, setN] = useState(0);
  const [tick, setTick] = useState(0);

  return (
    <UnstableCtx.Provider value={{ n, setN }}>
      <div>
        <DemoNote>
          New context object every render. Parent ticks still push a new value
          identity into context.
        </DemoNote>
        <div className="demo-row">
          <button type="button" className="demo-btn" onClick={() => setN((x) => x + 1)}>
            Bump n
          </button>
          <button type="button" className="demo-btn primary" onClick={() => setTick((t) => t + 1)}>
            Parent tick ({tick})
          </button>
        </div>
        <UnstableConsumer />
      </div>
    </UnstableCtx.Provider>
  );
}

export function ContextIdentityRight() {
  const [n, setN] = useState(0);
  const [tick, setTick] = useState(0);
  const value = useMemo(() => ({ n, setN }), [n]);

  return (
    <StableCtx.Provider value={value}>
      <div>
        <DemoNote>
          Memoized context value keeps identity stable when only unrelated parent
          state changes — memoized consumers can bail out.
        </DemoNote>
        <div className="demo-row">
          <button type="button" className="demo-btn" onClick={() => setN((x) => x + 1)}>
            Bump n
          </button>
          <button type="button" className="demo-btn primary" onClick={() => setTick((t) => t + 1)}>
            Parent tick ({tick})
          </button>
        </div>
        <StableConsumer />
      </div>
    </StableCtx.Provider>
  );
}

function expensiveFilter(query: string) {
  const out: string[] = [];
  for (let i = 0; i < 8000; i++) {
    const word = `item-${i}-${query}`;
    if (word.includes(query)) out.push(word);
  }
  return out.slice(0, 20);
}

export function HeavyWorkWrong() {
  const [query, setQuery] = useState("");
  const list = expensiveFilter(query);

  return (
    <div>
      <DemoNote>
        Heavy filter runs synchronously on every keystroke — typing feels sticky.
      </DemoNote>
      <div className="field">
        <label htmlFor="hw-w">Filter</label>
        <input id="hw-w" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <Metric tone="warn">showing {list.length} rows</Metric>
      <ul className="item-list">
        {list.map((row) => (
          <li key={row}>{row}</li>
        ))}
      </ul>
    </div>
  );
}

export function HeavyWorkRight() {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const list = expensiveFilter(deferred);

  return (
    <div>
      <DemoNote>
        Input updates urgently; useDeferredValue lets the heavy list catch up
        without blocking keystrokes as hard.
      </DemoNote>
      <div className="field">
        <label htmlFor="hw-r">Filter</label>
        <input id="hw-r" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <Metric tone="ok">
        query={query} deferred={deferred} rows={list.length}
      </Metric>
      <ul className="item-list">
        {list.map((row) => (
          <li key={row}>{row}</li>
        ))}
      </ul>
    </div>
  );
}

export function PropSpreadingWrong() {
  const label = "Save";
  const onSave = () => alert("saved");
  const variant = "primary";
  const leaked = { label, onSave, variant } as Record<string, unknown>;
  return (
    <div>
      <DemoNote>
        Spreading custom props onto a button leaks non-DOM attributes (inspect the
        element).
      </DemoNote>
      <button type="button" className="demo-btn primary" {...leaked}>
        {label}
      </button>
      <Metric tone="warn">Check DOM for label/onSave/variant attrs</Metric>
    </div>
  );
}

export function PropSpreadingRight() {
  const label = "Save";
  const onSave = () => alert("saved");
  return (
    <div>
      <DemoNote>Destructure known props; only forward DOM-safe rest.</DemoNote>
      <button type="button" className="demo-btn primary" onClick={onSave}>
        {label}
      </button>
      <Metric tone="ok">Clean DOM attributes</Metric>
    </div>
  );
}
