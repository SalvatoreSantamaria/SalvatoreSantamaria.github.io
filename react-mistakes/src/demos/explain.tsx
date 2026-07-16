import { ExplainPanel } from "../components/ExplainPanel";

export function LiftingStateWrong() {
  return (
    <ExplainPanel
      summary="State too high re-renders indifferent siblings; too low blocks sharing. Ownership is a design choice — demos are situational."
      wrongCode={`function App() {
  const [query, setQuery] = useState("");
  // everything under App re-renders on each keystroke
  return (
    <>
      <Search query={query} setQuery={setQuery} />
      <ExpensiveDashboard />
    </>
  );
}`}
      rightCode={`function App() {
  return (
    <>
      <Search /> {/* owns its own query state */}
      <ExpensiveDashboard />
    </>
  );
}

// Or lift only to the nearest common parent that needs shared data.`}
    />
  );
}

export function LiftingStateRight() {
  return (
    <ExplainPanel
      summary="Lift to the nearest common ancestor that truly needs the data; keep unrelated trees free."
      wrongCode={`// Prop-drill query through 6 layers that never use it`}
      rightCode={`// Colocate state, or use context/composition for cross-cutting reads`}
    />
  );
}

export function OverSpecifyingDepsWrong() {
  return (
    <ExplainPanel
      summary="Unstable objects/functions in dependency arrays retrigger effects every render."
      wrongCode={`useEffect(() => {
  sync(options);
}, [options]); // options is a new object each render`}
      rightCode={`const options = useMemo(() => ({ id }), [id]);
useEffect(() => {
  sync(options);
}, [options]);

// or depend on options.id and build inside the effect`}
    />
  );
}

export function OverSpecifyingDepsRight() {
  return <OverSpecifyingDepsWrong />;
}

export function ConditionalHooksWrong() {
  return (
    <ExplainPanel
      summary="Hooks must be called in the same order every render. Conditionals/loops break that contract."
      wrongCode={`function Profile({ isAdmin }) {
  if (isAdmin) {
    useEffect(() => { loadAdmin(); }, []);
  }
  useState(0);
  ...
}`}
      rightCode={`function Profile({ isAdmin }) {
  useEffect(() => {
    if (!isAdmin) return;
    loadAdmin();
  }, [isAdmin]);
  useState(0);
  ...
}`}
    />
  );
}

export function ConditionalHooksRight() {
  return <ConditionalHooksWrong />;
}

export function RefsDuringRenderWrong() {
  return (
    <ExplainPanel
      summary="Writing refs during render to mirror props or “fix” purity recreates render-phase bugs."
      wrongCode={`function Comp({ value }) {
  const ref = useRef(value);
  ref.current = value; // often OK for latest-ref pattern
  if (ref.current !== value) {
    ref.current = compute(value); // careful: render-phase writes
  }
}`}
      rightCode={`// Latest-ref pattern: assign in render is common for event handlers,
// but do not use refs as a substitute for state that should paint.
useEffect(() => {
  ref.current = value;
}, [value]);`}
    />
  );
}

export function RefsDuringRenderRight() {
  return <RefsDuringRenderWrong />;
}

export function CustomHookNotHookWrong() {
  return (
    <ExplainPanel
      summary="Helpers that call Hooks must be custom Hooks (use* name) and called unconditionally."
      wrongCode={`function loadUser(id) {
  const [user, setUser] = useState(null); // Hook in a normal function
  useEffect(() => { ... }, [id]);
  return user;
}`}
      rightCode={`function useUser(id) {
  const [user, setUser] = useState(null);
  useEffect(() => { ... }, [id]);
  return user;
}`}
    />
  );
}

export function CustomHookNotHookRight() {
  return <CustomHookNotHookWrong />;
}

export function GiantContextWrong() {
  return (
    <ExplainPanel
      summary="One mega-context forces wide re-renders whenever any field changes."
      wrongCode={`<AppContext.Provider value={{ user, theme, cart, flags, ... }}>`}
      rightCode={`<UserProvider>
  <ThemeProvider>
    <CartProvider>...</CartProvider>
  </ThemeProvider>
</UserProvider>`}
    />
  );
}

export function GiantContextRight() {
  return <GiantContextWrong />;
}

export function PropDrillingWrong() {
  return (
    <ExplainPanel
      summary="Threading props through many layers that do not use them is noisy — but context is not always required."
      wrongCode={`<App user={user}>
  <Layout user={user}>
    <Page user={user}>
      <Widget user={user} />`}
      rightCode={`// Composition: pass children already configured
// or context for truly cross-cutting data
<UserContext.Provider value={user}>
  <Layout><Page><Widget /></Page></Layout>
</UserContext.Provider>`}
    />
  );
}

export function PropDrillingRight() {
  return <PropDrillingWrong />;
}

export function PrematureMemoWrong() {
  return (
    <ExplainPanel
      summary="Memoizing everything obscures intent and often saves nothing measurable."
      wrongCode={`export default memo(function ListItem({ item }) {
  return <li>{item.name}</li>;
}); // cheap component, unstable props anyway`}
      rightCode={`// Profile first. Memoize hot leaves with stable props.
const ListItem = memo(function ListItem({ name }: { name: string }) {
  return <li>{name}</li>;
});`}
    />
  );
}

export function PrematureMemoRight() {
  return <PrematureMemoWrong />;
}

export function InheritanceWrong() {
  return (
    <ExplainPanel
      summary="Subclassing components couples lifecycles and fights hooks/composition."
      wrongCode={`class FancyButton extends Button {
  render() {
    return <div>{super.render()}</div>;
  }
}`}
      rightCode={`function FancyButton(props) {
  return (
    <div className="fancy">
      <Button {...props} />
    </div>
  );
}`}
    />
  );
}

export function InheritanceRight() {
  return <InheritanceWrong />;
}

export function BooleanPropsWrong() {
  return (
    <ExplainPanel
      summary="Stringly-typed flags and overlapping booleans make APIs easy to misuse."
      wrongCode={`<Modal open="false" isOpen={true} visible />`}
      rightCode={`<Modal open={false} />
// or: type Mode = "closed" | "open" | "minimized"`}
    />
  );
}

export function BooleanPropsRight() {
  return <BooleanPropsWrong />;
}

export function HocSoupWrong() {
  return (
    <ExplainPanel
      summary="Deep HOC pyramids obscure props and hurt TypeScript / debugging."
      wrongCode={`export default withAuth(withTheme(withRouter(withData(Page))))`}
      rightCode={`function Page() {
  const user = useAuth();
  const theme = useTheme();
  ...
}`}
    />
  );
}

export function HocSoupRight() {
  return <HocSoupWrong />;
}

export function BusinessLogicWrong() {
  return (
    <ExplainPanel
      summary="Components that own rules, I/O, and UI are hard to test. Extract pure logic."
      wrongCode={`function Checkout() {
  // tax math, discounts, fetch, validation, JSX...
}`}
      rightCode={`function computeTotal(cart, rates) { /* pure */ }
function useCheckout(cart) { /* hooks + I/O */ }
function Checkout() { /* render */ }`}
    />
  );
}

export function BusinessLogicRight() {
  return <BusinessLogicWrong />;
}

export function FindDomNodeWrong() {
  return (
    <ExplainPanel
      summary="findDOMNode and string refs are legacy and incompatible with modern React."
      wrongCode={`class Comp extends React.Component {
  componentDidMount() {
    findDOMNode(this).focus();
  }
  render() {
    return <input ref="input" />;
  }
}`}
      rightCode={`function Comp() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return <input ref={ref} />;
}`}
    />
  );
}

export function FindDomNodeRight() {
  return <FindDomNodeWrong />;
}
