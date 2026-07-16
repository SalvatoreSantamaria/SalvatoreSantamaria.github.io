import { memo, useMemo, useRef, useState } from "react";
import { DemoNote, Metric } from "../components/DemoWidgets";

export function CargoCultMemoWrong() {
  const [n, setN] = useState(0);
  const doubled = useMemo(() => n * 2, [n]);
  const label = useMemo(() => `value ${n}`, [n]);
  const flag = useMemo(() => n % 2 === 0, [n]);

  return (
    <div>
      <DemoNote>
        Trivial useMemo calls add noise for cheap math/strings — they do not make
        this faster in any meaningful way.
      </DemoNote>
      <button type="button" className="demo-btn primary" onClick={() => setN((x) => x + 1)}>
        Increment
      </button>
      <Metric tone="warn">
        {label}, doubled={doubled}, even={String(flag)}
      </Metric>
    </div>
  );
}

export function CargoCultMemoRight() {
  const [n, setN] = useState(0);
  const doubled = n * 2;
  const label = `value ${n}`;
  const flag = n % 2 === 0;

  return (
    <div>
      <DemoNote>Compute cheap values inline. Memoize when profiling says so.</DemoNote>
      <button type="button" className="demo-btn primary" onClick={() => setN((x) => x + 1)}>
        Increment
      </button>
      <Metric tone="ok">
        {label}, doubled={doubled}, even={String(flag)}
      </Metric>
    </div>
  );
}

const MemoChild = memo(function MemoChild({
  style,
  onPing,
}: {
  style: { color: string };
  onPing: () => void;
}) {
  const renders = useRef(0);
  renders.current += 1;
  return (
    <div className="demo-row">
      <button type="button" className="demo-btn" style={style} onClick={onPing}>
        Memo child
      </button>
      <Metric>child renders: {renders.current}</Metric>
    </div>
  );
});

export function UnstableInlinePropsWrong() {
  const [parent, setParent] = useState(0);
  return (
    <div>
      <DemoNote>
        New style object + new onPing every parent render → memo child still
        re-renders.
      </DemoNote>
      <button type="button" className="demo-btn primary" onClick={() => setParent((p) => p + 1)}>
        Re-render parent ({parent})
      </button>
      <MemoChild style={{ color: "teal" }} onPing={() => undefined} />
    </div>
  );
}

const stableStyle = { color: "teal" };

export function UnstableInlinePropsRight() {
  const [parent, setParent] = useState(0);
  const onPing = useRef(() => undefined).current;
  return (
    <div>
      <DemoNote>Stable style reference + stable callback → memo child skips work.</DemoNote>
      <button type="button" className="demo-btn primary" onClick={() => setParent((p) => p + 1)}>
        Re-render parent ({parent})
      </button>
      <MemoChild style={stableStyle} onPing={onPing} />
    </div>
  );
}

export function ComponentInsideWrong() {
  const [parent, setParent] = useState(0);

  function Inner() {
    const [text, setText] = useState("");
    return (
      <div className="field">
        <label htmlFor="inner-w">Inner state</label>
        <input id="inner-w" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
    );
  }

  return (
    <div>
      <DemoNote>
        Type in the input, then re-render the parent — Inner is a new component type
        each time, so state resets.
      </DemoNote>
      <button type="button" className="demo-btn primary" onClick={() => setParent((p) => p + 1)}>
        Re-render parent ({parent})
      </button>
      <Inner />
    </div>
  );
}

function OuterInner() {
  const [text, setText] = useState("");
  return (
    <div className="field">
      <label htmlFor="inner-r">Inner state</label>
      <input id="inner-r" value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}

export function ComponentInsideRight() {
  const [parent, setParent] = useState(0);
  return (
    <div>
      <DemoNote>Module-scope component keeps state across parent renders.</DemoNote>
      <button type="button" className="demo-btn primary" onClick={() => setParent((p) => p + 1)}>
        Re-render parent ({parent})
      </button>
      <OuterInner />
    </div>
  );
}

export function WrongUseRefWrong() {
  const count = useRef(0);
  return (
    <div>
      <DemoNote>
        Clicking bumps ref.current but the Metric never updates — refs do not
        re-render.
      </DemoNote>
      <button
        type="button"
        className="demo-btn primary"
        onClick={() => {
          count.current += 1;
        }}
      >
        Increment ref
      </button>
      <Metric tone="warn">displayed count: {count.current}</Metric>
    </div>
  );
}

export function WrongUseRefRight() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <DemoNote>State drives UI updates.</DemoNote>
      <button type="button" className="demo-btn primary" onClick={() => setCount((c) => c + 1)}>
        Increment state
      </button>
      <Metric tone="ok">displayed count: {count}</Metric>
    </div>
  );
}
