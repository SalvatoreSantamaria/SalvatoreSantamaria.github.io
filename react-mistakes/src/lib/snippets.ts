/** Curated code samples shown under each demo. Comments explain why wrong/right. */
export const snippets: Record<string, { wrong: string; right: string }> = {
  "mutating-state": {
    wrong: `// ❌ Mutating the same array reference
const [items, setItems] = useState(["a", "b"]);

function add() {
  items.push("c");   // mutates in place
  setItems(items);   // same reference → React may skip re-render
}`,
    right: `// ✅ Create a new array (immutable update)
const [items, setItems] = useState(["a", "b"]);

function add() {
  // new reference → React knows state changed
  setItems((prev) => [...prev, "c"]);
}`,
  },

  "mutating-props": {
    wrong: `// ❌ Props are owned by the parent — do not mutate them
function TagList({ tags }) {
  function add() {
    tags.push("new"); // mutates parent's data unexpectedly
  }
  return <button onClick={add}>Add</button>;
}`,
    right: `// ✅ Ask the parent to update via a callback
function TagList({ tags, onAdd }) {
  return <button onClick={() => onAdd("new")}>Add</button>;
}

// Parent:
setTags((t) => [...t, "new"]);`,
  },

  "derived-state": {
    wrong: `// ❌ Duplicating derived data in state + syncing with an effect
const [first, setFirst] = useState("Ada");
const [last, setLast] = useState("Lovelace");
const [fullName, setFullName] = useState("Ada Lovelace");

useEffect(() => {
  setFullName(\`\${first} \${last}\`); // extra render, easy to drift
}, [first, last]);`,
    right: `// ✅ Derive during render — one source of truth
const [first, setFirst] = useState("Ada");
const [last, setLast] = useState("Lovelace");
const fullName = \`\${first} \${last}\`; // always in sync`,
  },

  "side-effects-in-render": {
    wrong: `// ❌ Side effects during render break purity
function Search({ query }) {
  fetch(\`/api?q=\${query}\`); // runs every render, including Strict Mode doubles
  return <input value={query} />;
}`,
    right: `// ✅ Synchronize in an effect (with cleanup)
function Search({ query }) {
  useEffect(() => {
    let ignore = false;
    fetch(\`/api?q=\${query}\`)
      .then((r) => r.json())
      .then((data) => { if (!ignore) setResults(data); });
    return () => { ignore = true; };
  }, [query]);
  return <input value={query} />;
}`,
  },

  "setstate-in-render": {
    wrong: `// ❌ setState during render retriggers render → can loop
function Counter() {
  const [n, setN] = useState(0);
  setN(n + 1); // unconditional update in render body
  return <p>{n}</p>;
}`,
    right: `// ✅ Update from an event (or a carefully guarded effect)
function Counter() {
  const [n, setN] = useState(0);
  return (
    <button onClick={() => setN((x) => x + 1)}>
      {n}
    </button>
  );
}`,
  },

  "impure-render": {
    wrong: `// ❌ Impure values during render are non-deterministic
function Badge() {
  const id = Math.random(); // changes every paint / Strict Mode pass
  return <span>{id}</span>;
}`,
    right: `// ✅ Capture impure values in state or an event
function Badge() {
  const [id] = useState(() => Math.random()); // stable for this mount
  return <span>{id}</span>;
}`,
  },

  "state-vs-ref": {
    wrong: `// ❌ State for values that should not paint → needless re-renders
const [keystrokes, setKeystrokes] = useState(0);

<input onChange={() => setKeystrokes((k) => k + 1)} />`,
    right: `// ✅ Ref for bookkeeping that is not shown in the UI
const keystrokes = useRef(0);

<input onChange={() => { keystrokes.current += 1; }} />
// read keystrokes.current when you submit / log`,
  },

  "lifting-state": {
    wrong: `// ❌ State too high: every keystroke re-renders ExpensiveDashboard
function App() {
  const [query, setQuery] = useState("");
  return (
    <>
      <Search query={query} setQuery={setQuery} />
      <ExpensiveDashboard />
    </>
  );
}`,
    right: `// ✅ Colocate state where it is used (or lift only to a shared parent)
function App() {
  return (
    <>
      <Search /> {/* owns its own query */}
      <ExpensiveDashboard />
    </>
  );
}`,
  },

  "reset-state-with-key": {
    wrong: `// ❌ Switching entities without reset leaves stale local state
function Page({ userId }) {
  return <Editor userId={userId} />; // draft text survives user change
}`,
    right: `// ✅ Remount with a changing key to reset initial state
function Page({ userId }) {
  return <Editor key={userId} userId={userId} />;
}`,
  },

  "missing-keys": {
    wrong: `// ❌ No keys → React warns and may reuse the wrong DOM nodes
{items.map((item) => (
  <li>{item.label}</li>
))}`,
    right: `// ✅ Stable unique key from data identity
{items.map((item) => (
  <li key={item.id}>{item.label}</li>
))}`,
  },

  "index-as-key": {
    wrong: `// ❌ Index keys tie state to position — reorder breaks inputs
{items.map((item, index) => (
  <Row key={index} label={item.label} />
))}`,
    right: `// ✅ Id keys keep each row's state with the item
{items.map((item) => (
  <Row key={item.id} label={item.label} />
))}`,
  },

  "unstable-keys": {
    wrong: `// ❌ New key every render remounts the row (focus/state wiped)
{items.map((item) => (
  <Row key={Math.random()} label={item.label} />
))}`,
    right: `// ✅ Keys must be stable across renders for the same item
{items.map((item) => (
  <Row key={item.id} label={item.label} />
))}`,
  },

  "key-on-wrong-element": {
    wrong: `// ❌ Key on an inner node; the list item itself has no key
{items.map((item) => (
  <li>
    <span key={item.id}>{item.label}</span>
  </li>
))}`,
    right: `// ✅ Key on the outermost element returned from map
{items.map((item) => (
  <li key={item.id}>
    <span>{item.label}</span>
  </li>
))}`,
  },

  "missing-effect-deps": {
    wrong: `// ❌ Empty deps → effect keeps the first userId forever (stale)
useEffect(() => {
  setLabel(\`Loaded \${userId}\`);
}, []); // missing userId`,
    right: `// ✅ List every reactive value the effect reads
useEffect(() => {
  setLabel(\`Loaded \${userId}\`);
}, [userId]);`,
  },

  "over-specifying-deps": {
    wrong: `// ❌ New object every render → effect thrash
const options = { id: userId };
useEffect(() => {
  sync(options);
}, [options]);`,
    right: `// ✅ Depend on primitives, or memoize when identity matters
useEffect(() => {
  sync({ id: userId });
}, [userId]);`,
  },

  "infinite-effect-loop": {
    wrong: `// ❌ Effect setStates a value it depends on → infinite loop
useEffect(() => {
  setCount((c) => c + 1);
}, [count]);`,
    right: `// ✅ Update from an event, or derive without an effect
<button onClick={() => setCount((c) => c + 1)}>Inc</button>`,
  },

  "fetch-without-cancel": {
    wrong: `// ❌ Slow response can overwrite a newer one (race)
useEffect(() => {
  fetchUser(id).then(setUser);
}, [id]);`,
    right: `// ✅ Ignore stale responses in cleanup
useEffect(() => {
  let ignore = false;
  fetchUser(id).then((u) => {
    if (!ignore) setUser(u);
  });
  return () => { ignore = true; };
}, [id]);`,
  },

  "missing-cleanup": {
    wrong: `// ❌ Interval keeps running after unmount
useEffect(() => {
  setInterval(onTick, 500);
  // no cleanup
}, [onTick]);`,
    right: `// ✅ Clear timers / unsubscribe in cleanup
useEffect(() => {
  const id = setInterval(onTick, 500);
  return () => clearInterval(id);
}, [onTick]);`,
  },

  "effect-for-derived-data": {
    wrong: `// ❌ Effect only to compute a value you already have
useEffect(() => {
  setTotal(items.reduce((a, b) => a + b, 0));
}, [items]);`,
    right: `// ✅ Compute during render
const total = items.reduce((a, b) => a + b, 0);`,
  },

  "effect-for-events": {
    wrong: `// ❌ Flag + effect to handle a click (indirect, racy)
const [pending, setPending] = useState(false);
useEffect(() => {
  if (!pending) return;
  save();
  setPending(false);
}, [pending]);

<button onClick={() => setPending(true)}>Save</button>`,
    right: `// ✅ Do the work in the event handler
<button onClick={() => save()}>Save</button>`,
  },

  "sync-props-to-state": {
    wrong: `// ❌ Copying props → state via effect = second source of truth
const [value, setValue] = useState(name);
useEffect(() => {
  setValue(name);
}, [name]);`,
    right: `// ✅ Remount when the entity changes (or use the prop directly)
<Editor key={userId} name={name} />`,
  },

  "conditional-hooks": {
    wrong: `// ❌ Hooks inside conditionals break call order
if (isAdmin) {
  useEffect(() => { loadAdmin(); }, []);
}`,
    right: `// ✅ Hooks at the top level; condition inside the effect
useEffect(() => {
  if (!isAdmin) return;
  loadAdmin();
}, [isAdmin]);`,
  },

  "cargo-cult-memo": {
    wrong: `// ❌ Memoizing trivial work adds noise, not speed
const doubled = useMemo(() => n * 2, [n]);
const label = useMemo(() => \`value \${n}\`, [n]);`,
    right: `// ✅ Compute cheap values inline; memoize when profiling says so
const doubled = n * 2;
const label = \`value \${n}\`;`,
  },

  "unstable-inline-props": {
    wrong: `// ❌ New object/fn every render defeats React.memo
<MemoChild
  style={{ color: "teal" }}
  onPing={() => {}}
/>`,
    right: `// ✅ Stable references when the child is memoized
const style = useMemo(() => ({ color: "teal" }), []);
const onPing = useCallback(() => {}, []);
<MemoChild style={style} onPing={onPing} />`,
  },

  "component-inside-component": {
    wrong: `// ❌ Inner component type is new every parent render → remount
function Parent() {
  function Inner() {
    const [text, setText] = useState("");
    return <input value={text} onChange={(e) => setText(e.target.value)} />;
  }
  return <Inner />; // state resets when Parent re-renders
}`,
    right: `// ✅ Declare components at module scope
function Inner() {
  const [text, setText] = useState("");
  return <input value={text} onChange={(e) => setText(e.target.value)} />;
}

function Parent() {
  return <Inner />;
}`,
  },

  "wrong-useref": {
    wrong: `// ❌ Changing ref.current does not re-render
const count = useRef(0);
<button onClick={() => { count.current += 1; }}>
  {count.current} {/* UI stays stale */}
</button>`,
    right: `// ✅ Use state for values that should appear on screen
const [count, setCount] = useState(0);
<button onClick={() => setCount((c) => c + 1)}>
  {count}
</button>`,
  },

  "refs-during-render": {
    wrong: `// ❌ Using refs as a stand-in for state that should paint
function Comp({ value }) {
  const ref = useRef(value);
  ref.current = expensiveTransform(value); // easy to misuse in render
  return <p>{ref.current}</p>; // may not update as you expect
}`,
    right: `// ✅ Derive for display; reserve refs for non-visual / imperative use
function Comp({ value }) {
  const display = expensiveTransform(value);
  return <p>{display}</p>;
}`,
  },

  "custom-hook-not-hook": {
    wrong: `// ❌ Helper that calls Hooks but is not a custom Hook
function loadUser(id) {
  const [user, setUser] = useState(null); // Rules of Hooks / lint break
  useEffect(() => { ... }, [id]);
  return user;
}`,
    right: `// ✅ Name it use* and call it unconditionally from components
function useUser(id) {
  const [user, setUser] = useState(null);
  useEffect(() => { ... }, [id]);
  return user;
}`,
  },

  "controlled-uncontrolled-switch": {
    wrong: `// ❌ Starts uncontrolled (undefined), then becomes controlled
const [text, setText] = useState(undefined);
<input value={text} onChange={(e) => setText(e.target.value)} />
// later: setText("") → React warns about switching modes`,
    right: `// ✅ Always controlled with a defined string
const [text, setText] = useState("");
<input value={text} onChange={(e) => setText(e.target.value)} />`,
  },

  "semi-controlled": {
    wrong: `// ❌ Mixing defaultValue and value confuses ownership
<input defaultValue="hello" value={text} onChange={...} />`,
    right: `// ✅ Pick one mode
// Controlled:
<input value={text} onChange={(e) => setText(e.target.value)} />
// Uncontrolled:
<input defaultValue="hello" ref={ref} />`,
  },

  "form-prevent-default": {
    wrong: `// ❌ Native submit reloads the page and wipes React state
<form onSubmit={() => save(name)}>
  <button type="submit">Save</button>
</form>`,
    right: `// ✅ preventDefault keeps the SPA in place
<form onSubmit={(e) => {
  e.preventDefault();
  save(name);
}}>
  <button type="submit">Save</button>
</form>`,
  },

  "stale-closure": {
    wrong: `// ❌ Async handler closes over an old count
async function onClick() {
  const snapshot = count;
  await delay(800);
  setLog(snapshot); // may be stale if count changed
}`,
    right: `// ✅ Read latest via ref (or functional updates)
const countRef = useRef(count);
countRef.current = count;

async function onClick() {
  await delay(800);
  setLog(countRef.current);
}`,
  },

  "ignore-loading-error": {
    wrong: `// ❌ No loading/error — failures look like stale success
async function load() {
  const data = await fetchData();
  setData(data); // if it throws, UI still shows old data
}`,
    right: `// ✅ Model status explicitly
const [status, setStatus] = useState("idle");
async function load() {
  setStatus("loading");
  try {
    setData(await fetchData());
    setStatus("success");
  } catch {
    setStatus("error");
  }
}`,
  },

  "waterfall-requests": {
    wrong: `// ❌ Independent awaits in sequence double the wait
await fetchA(); // 400ms
await fetchB(); // 400ms → ~800ms total`,
    right: `// ✅ Parallel when requests do not depend on each other
await Promise.all([fetchA(), fetchB()]); // ~400ms`,
  },

  "double-fetch-strict": {
    wrong: `// ❌ Strict Mode remounts in dev; unguarded effects "double fetch"
useEffect(() => {
  fetchUser().then(setUser);
}, []);`,
    right: `// ✅ Cleanup ignore/abort — only the latest result applies
useEffect(() => {
  let ignore = false;
  fetchUser().then((u) => { if (!ignore) setUser(u); });
  return () => { ignore = true; };
}, []);`,
  },

  "context-identity": {
    wrong: `// ❌ New object every render → all consumers re-render
<Ctx.Provider value={{ n, setN }}>
  {children}
</Ctx.Provider>`,
    right: `// ✅ Memoize the value (or split state/dispatch contexts)
const value = useMemo(() => ({ n, setN }), [n]);
<Ctx.Provider value={value}>{children}</Ctx.Provider>`,
  },

  "giant-context": {
    wrong: `// ❌ One mega-context: any field change notifies everyone
<AppContext.Provider value={{ user, theme, cart, flags }} />`,
    right: `// ✅ Split by concern so updates stay local
<UserProvider>
  <ThemeProvider>
    <CartProvider>{children}</CartProvider>
  </ThemeProvider>
</UserProvider>`,
  },

  "prop-drilling": {
    wrong: `// ❌ Threading unused props through many layers
<App user={user}>
  <Layout user={user}>
    <Page user={user}>
      <Widget user={user} />`,
    right: `// ✅ Composition or context for cross-cutting data
<UserContext.Provider value={user}>
  <Layout><Page><Widget /></Page></Layout>
</UserContext.Provider>`,
  },

  "premature-memo": {
    wrong: `// ❌ memo everywhere without a measured problem
export default memo(function ListItem({ item }) {
  return <li>{item.name}</li>;
});`,
    right: `// ✅ Profile first; memoize hot leaves with stable props
const ListItem = memo(function ListItem({ name }) {
  return <li>{name}</li>;
});`,
  },

  "heavy-work-no-deferral": {
    wrong: `// ❌ Heavy work on every keystroke blocks typing
const list = expensiveFilter(query);
<input value={query} onChange={(e) => setQuery(e.target.value)} />`,
    right: `// ✅ Defer the expensive list; keep input urgent
const deferred = useDeferredValue(query);
const list = expensiveFilter(deferred);
<input value={query} onChange={(e) => setQuery(e.target.value)} />`,
  },

  "inheritance-over-composition": {
    wrong: `// ❌ Subclassing components fights hooks and composition
class FancyButton extends Button {
  render() {
    return <div>{super.render()}</div>;
  }
}`,
    right: `// ✅ Compose with props and children
function FancyButton(props) {
  return (
    <div className="fancy">
      <Button {...props} />
    </div>
  );
}`,
  },

  "prop-spreading-dom": {
    wrong: `// ❌ Spreading custom props onto DOM leaks invalid attributes
const props = { label: "Save", onSave, variant: "primary" };
<button {...props}>{props.label}</button>`,
    right: `// ✅ Destructure known props; forward only DOM-safe rest
const { label, onSave, ...domSafe } = props;
<button onClick={onSave} {...domSafe}>{label}</button>`,
  },

  "boolean-props-api": {
    wrong: `// ❌ Stringly-typed / overlapping flags are easy to misuse
<Modal open="false" isOpen={true} visible />`,
    right: `// ✅ Real booleans or a clear discriminated union
<Modal open={false} />
// type Mode = "closed" | "open" | "minimized"`,
  },

  "hoc-soup": {
    wrong: `// ❌ Deep HOC pyramids obscure props and types
export default withAuth(withTheme(withRouter(withData(Page))))`,
    right: `// ✅ Prefer custom hooks
function Page() {
  const user = useAuth();
  const theme = useTheme();
  // ...
}`,
  },

  "business-logic-in-components": {
    wrong: `// ❌ Fat component owns rules, I/O, and JSX
function Checkout() {
  // tax math, discounts, fetch, validation, markup...
}`,
    right: `// ✅ Extract pure logic + hooks; keep the component thin
function computeTotal(cart, rates) { /* pure */ }
function useCheckout(cart) { /* hooks + I/O */ }
function Checkout() { /* render */ }`,
  },

  "direct-dom-manipulation": {
    wrong: `// ❌ Imperative DOM fights React ownership
document.querySelector("#label").textContent = "Hi";
// a later re-render can wipe this`,
    right: `// ✅ Drive UI from state
const [label, setLabel] = useState("Hi");
<button onClick={() => setLabel("Hello")}>Update</button>
<p>{label}</p>`,
  },

  "finddomnode-string-refs": {
    wrong: `// ❌ Legacy APIs removed / unsupported in modern React
class Comp extends React.Component {
  componentDidMount() {
    findDOMNode(this).focus();
  }
  render() {
    return <input ref="input" />;
  }
}`,
    right: `// ✅ useRef / callback refs
function Comp() {
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return <input ref={ref} />;
}`,
  },

  "unsafe-innerhtml": {
    wrong: `// ❌ Untrusted HTML → XSS
<div dangerouslySetInnerHTML={{ __html: userHtml }} />`,
    right: `// ✅ Prefer text (escaped). Sanitize if HTML is required.
<div>{userText}</div>
// or: sanitize(userHtml) with a trusted library + allowlist`,
  },

  "clickable-div": {
    wrong: `// ❌ Divs are not keyboard-accessible buttons by default
<div onClick={onSave}>Save</div>`,
    right: `// ✅ Use a real button (focus + Enter/Space + correct role)
<button type="button" onClick={onSave}>Save</button>`,
  },

  "broken-label": {
    wrong: `// ❌ Visible text is not associated with the control
<p>Email</p>
<input />`,
    right: `// ✅ htmlFor matches id (or wrap the input in <label>)
<label htmlFor="email">Email</label>
<input id="email" />`,
  },
};
