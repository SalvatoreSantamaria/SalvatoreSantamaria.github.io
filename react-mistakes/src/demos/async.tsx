import { useEffect, useRef, useState } from "react";
import { DemoNote, Metric } from "../components/DemoWidgets";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function StaleClosureWrong() {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState("—");

  async function handleClick() {
    const snapshot = count;
    await delay(800);
    setLog(`async saw count=${snapshot}`);
  }

  return (
    <div>
      <DemoNote>
        Increment a few times, then click Async read quickly after — the handler
        may log an older count.
      </DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setCount((c) => c + 1)}>
          Increment ({count})
        </button>
        <button type="button" className="demo-btn primary" onClick={() => void handleClick()}>
          Async read
        </button>
        <Metric tone="warn">{log}</Metric>
      </div>
    </div>
  );
}

export function StaleClosureRight() {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState("—");
  const countRef = useRef(count);
  countRef.current = count;

  async function handleClick() {
    await delay(800);
    setLog(`async saw count=${countRef.current}`);
  }

  return (
    <div>
      <DemoNote>Ref (or functional updates) reads the latest value after await.</DemoNote>
      <div className="demo-row">
        <button type="button" className="demo-btn" onClick={() => setCount((c) => c + 1)}>
          Increment ({count})
        </button>
        <button type="button" className="demo-btn primary" onClick={() => void handleClick()}>
          Async read
        </button>
        <Metric tone="ok">{log}</Metric>
      </div>
    </div>
  );
}

type Status = "idle" | "loading" | "success" | "error";

export function IgnoreLoadingWrong() {
  const [data, setData] = useState("Old cached value");

  async function load() {
    await delay(900);
    if (Math.random() > 0.45) setData(`Fresh ${Date.now()}`);
    // failures silently keep old data
  }

  return (
    <div>
      <DemoNote>
        No loading/error UI — failures look like stale success. Click Load a few
        times.
      </DemoNote>
      <button type="button" className="demo-btn primary" onClick={() => void load()}>
        Load
      </button>
      <Metric tone="warn">{data}</Metric>
    </div>
  );
}

export function IgnoreLoadingRight() {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState("—");

  async function load() {
    setStatus("loading");
    await delay(900);
    if (Math.random() > 0.45) {
      setData(`Fresh ${Date.now()}`);
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  return (
    <div>
      <DemoNote>Explicit status makes waiting and failure visible.</DemoNote>
      <button type="button" className="demo-btn primary" onClick={() => void load()}>
        Load
      </button>
      <Metric tone={status === "error" ? "warn" : status === "success" ? "ok" : "neutral"}>
        {status}: {status === "loading" ? "…" : data}
      </Metric>
    </div>
  );
}

export function WaterfallWrong() {
  const [ms, setMs] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const t0 = performance.now();
    await delay(400);
    await delay(400);
    setMs(Math.round(performance.now() - t0));
    setBusy(false);
  }

  return (
    <div>
      <DemoNote>Two independent 400ms awaits run in sequence (~800ms).</DemoNote>
      <button type="button" className="demo-btn primary" disabled={busy} onClick={() => void run()}>
        Run waterfall
      </button>
      <Metric tone="warn">{ms == null ? "—" : `${ms} ms`}</Metric>
    </div>
  );
}

export function WaterfallRight() {
  const [ms, setMs] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const t0 = performance.now();
    await Promise.all([delay(400), delay(400)]);
    setMs(Math.round(performance.now() - t0));
    setBusy(false);
  }

  return (
    <div>
      <DemoNote>Promise.all runs them in parallel (~400ms).</DemoNote>
      <button type="button" className="demo-btn primary" disabled={busy} onClick={() => void run()}>
        Run parallel
      </button>
      <Metric tone="ok">{ms == null ? "—" : `${ms} ms`}</Metric>
    </div>
  );
}

export function DoubleFetchWrong() {
  const [fetches, setFetches] = useState(0);
  const [mounted, setMounted] = useState(true);
  const onFetch = useRef(() => setFetches((n) => n + 1));
  onFetch.current = () => setFetches((n) => n + 1);

  return (
    <div>
      <DemoNote>
        In React 18+ Strict Mode (dev), effects mount → clean → mount again. Without
        an ignore/abort guard you can apply duplicate work. Toggle remount to
        experiment.
      </DemoNote>
      <button type="button" className="demo-btn" onClick={() => setMounted((m) => !m)}>
        {mounted ? "Unmount" : "Mount"}
      </button>
      {mounted && <FetchCounter onFetchRef={onFetch} cleanup={false} />}
      <Metric tone="warn">fetch starts: {fetches}</Metric>
    </div>
  );
}

function FetchCounter({
  onFetchRef,
  cleanup,
}: {
  onFetchRef: React.MutableRefObject<() => void>;
  cleanup: boolean;
}) {
  useEffect(() => {
    let ignore = false;
    onFetchRef.current();
    const id = window.setTimeout(() => {
      if (!ignore) {
        /* pretend response applied */
      }
    }, 300);
    return () => {
      if (cleanup) ignore = true;
      clearTimeout(id);
    };
  }, [onFetchRef, cleanup]);
  return <Metric>child mounted</Metric>;
}

export function DoubleFetchRight() {
  const [fetches, setFetches] = useState(0);
  const [applied, setApplied] = useState(0);
  const [mounted, setMounted] = useState(true);
  const onFetch = useRef(() => setFetches((n) => n + 1));
  const onApply = useRef(() => setApplied((n) => n + 1));
  onFetch.current = () => setFetches((n) => n + 1);
  onApply.current = () => setApplied((n) => n + 1);

  return (
    <div>
      <DemoNote>
        Cleanup ignore flag means duplicate starts are OK in dev; only non-ignored
        results apply.
      </DemoNote>
      <button type="button" className="demo-btn" onClick={() => setMounted((m) => !m)}>
        {mounted ? "Unmount" : "Mount"}
      </button>
      {mounted && <GuardedFetch onFetchRef={onFetch} onApplyRef={onApply} />}
      <Metric>starts: {fetches}</Metric>
      <Metric tone="ok">applied: {applied}</Metric>
    </div>
  );
}

function GuardedFetch({
  onFetchRef,
  onApplyRef,
}: {
  onFetchRef: React.MutableRefObject<() => void>;
  onApplyRef: React.MutableRefObject<() => void>;
}) {
  useEffect(() => {
    let ignore = false;
    onFetchRef.current();
    const id = window.setTimeout(() => {
      if (!ignore) onApplyRef.current();
    }, 300);
    return () => {
      ignore = true;
      clearTimeout(id);
    };
  }, [onFetchRef, onApplyRef]);
  return <Metric>child mounted (guarded)</Metric>;
}
