export type MistakeMode = "live" | "explain";

export type MistakeCategoryId =
  | "state-rendering"
  | "lists-keys"
  | "effects"
  | "hooks-memo"
  | "forms"
  | "async-data"
  | "performance"
  | "composition"
  | "dom-legacy"
  | "a11y";

export type MistakeCategory = {
  id: MistakeCategoryId;
  label: string;
  description: string;
};

export const categories: MistakeCategory[] = [
  {
    id: "state-rendering",
    label: "State & Rendering",
    description: "How state updates, purity, and derived values belong in the render model.",
  },
  {
    id: "lists-keys",
    label: "Lists & Keys",
    description: "Stable identity for list items so React can reconcile correctly.",
  },
  {
    id: "effects",
    label: "Effects & Subscriptions",
    description: "When effects help — and when they create stale data, races, or loops.",
  },
  {
    id: "hooks-memo",
    label: "Hooks & Memoization",
    description: "Rules of Hooks, refs, and using memo for the right reasons.",
  },
  {
    id: "forms",
    label: "Forms & Inputs",
    description: "Controlled vs uncontrolled inputs and predictable form submit behavior.",
  },
  {
    id: "async-data",
    label: "Async & Data",
    description: "Stale closures, loading/error UI, and parallel vs waterfall fetching.",
  },
  {
    id: "performance",
    label: "Performance & Re-renders",
    description: "Context identity, deferring heavy work, and avoiding premature memo.",
  },
  {
    id: "composition",
    label: "Composition & Structure",
    description: "Prefer composition over inheritance; keep components testable.",
  },
  {
    id: "dom-legacy",
    label: "DOM & Legacy",
    description: "Prefer React state over manual DOM; avoid unsafe and legacy APIs.",
  },
  {
    id: "a11y",
    label: "Accessibility",
    description: "Semantic elements and correct label associations in React UIs.",
  },
];

export type Mistake = {
  id: number;
  slug: string;
  title: string;
  mode: MistakeMode;
  category: MistakeCategoryId;
  problem: string;
  solution: string;
};

export const mistakes: Mistake[] = [
  {
    id: 1,
    slug: "mutating-state",
    title: "Mutating state directly",
    mode: "live",
    category: "state-rendering",
    problem:
      "Pushing into or mutating an array/object in state and then calling setState with the same reference often skips a re-render.",
    solution:
      "Treat state as immutable. Copy with spread, map, filter, or structuredClone before updating.",
  },
  {
    id: 2,
    slug: "mutating-props",
    title: "Mutating props",
    mode: "live",
    category: "state-rendering",
    problem:
      "Props are read-only. Mutating them breaks one-way data flow and causes confusing bugs for the parent.",
    solution:
      "Copy data into local state if you need to edit it, or lift the update to the parent via a callback.",
  },
  {
    id: 3,
    slug: "derived-state",
    title: "Storing derived state",
    mode: "live",
    category: "state-rendering",
    problem:
      "Duplicating computed values in useState drifts out of sync with the source and needs extra effect syncing.",
    solution:
      "Compute derived values during render (or with useMemo only if expensive). One source of truth.",
  },
  {
    id: 4,
    slug: "side-effects-in-render",
    title: "Side effects during render",
    mode: "live",
    category: "state-rendering",
    problem:
      "Fetching, writing to external stores, or subscriptions in the render body run too often and break purity.",
    solution:
      "Put synchronization in useEffect (or event handlers). Keep render pure: props/state in → JSX out.",
  },
  {
    id: 5,
    slug: "setstate-in-render",
    title: "Calling setState during render",
    mode: "live",
    category: "state-rendering",
    problem:
      "Unconditional setState in the render body retriggers render and can loop until React bails out.",
    solution:
      "Update state in event handlers or effects. During render, only compute the next UI from current state.",
  },
  {
    id: 6,
    slug: "impure-render",
    title: "Impure render",
    mode: "live",
    category: "state-rendering",
    problem:
      "Math.random(), Date.now(), or mutating external data while rendering makes UI non-deterministic and hard to debug.",
    solution:
      "Generate impure values in events/effects and store them in state/refs. Render from that snapshot.",
  },
  {
    id: 7,
    slug: "state-vs-ref",
    title: "Using state where a ref is enough",
    mode: "live",
    category: "state-rendering",
    problem:
      "Putting every changing value in useState forces re-renders even when the UI does not need to update.",
    solution:
      "Use useRef for mutable values that should not trigger paint (timers, latest ids, imperative handles).",
  },
  {
    id: 8,
    slug: "lifting-state",
    title: "Wrong state ownership (lifting)",
    mode: "explain",
    category: "state-rendering",
    problem:
      "State too high re-renders unrelated siblings; state too low blocks siblings from sharing updates.",
    solution:
      "Lift state to the nearest common ancestor that needs it. Prefer composition so parents stay thin.",
  },
  {
    id: 9,
    slug: "reset-state-with-key",
    title: "Resetting state incorrectly",
    mode: "live",
    category: "state-rendering",
    problem:
      "Manually clearing every field is error-prone; forgetting one leaves stale values when the entity changes.",
    solution:
      "Give the subtree a changing key (e.g. userId) so React remounts and initial state resets cleanly.",
  },
  {
    id: 10,
    slug: "missing-keys",
    title: "Missing keys in lists",
    mode: "live",
    category: "lists-keys",
    problem:
      "Without keys, React warns and may reuse the wrong DOM nodes when the list changes.",
    solution:
      "Provide a stable unique key from your data identity (id), not from render order alone.",
  },
  {
    id: 11,
    slug: "index-as-key",
    title: "Using index as key when the list reorders",
    mode: "live",
    category: "lists-keys",
    problem:
      "Index keys tie state to position. Reorder/filter/insert and inputs keep the wrong item’s state.",
    solution:
      "Use stable item ids as keys so local state travels with the item.",
  },
  {
    id: 12,
    slug: "unstable-keys",
    title: "Unstable keys (new every render)",
    mode: "live",
    category: "lists-keys",
    problem:
      "key={Math.random()} remounts every row on each parent render, wiping focus and local state.",
    solution:
      "Keys must be stable across renders for the same item.",
  },
  {
    id: 13,
    slug: "key-on-wrong-element",
    title: "Key on the wrong element",
    mode: "live",
    category: "lists-keys",
    problem:
      "Putting key on an inner child instead of the outermost element returned from map confuses reconciliation.",
    solution:
      "Put key on the top-level element (or Fragment) returned from the map callback.",
  },
  {
    id: 14,
    slug: "missing-effect-deps",
    title: "Missing effect dependencies",
    mode: "live",
    category: "effects",
    problem:
      "Omitting deps leaves the effect closed over stale props/state, so it runs with outdated values.",
    solution:
      "List every reactive value the effect reads, or restructure so the effect does not need them.",
  },
  {
    id: 15,
    slug: "over-specifying-deps",
    title: "Over-specifying effect dependencies",
    mode: "explain",
    category: "effects",
    problem:
      "Stuffing unstable objects/functions into deps retriggers effects constantly and causes thrash.",
    solution:
      "Stabilize with useCallback/useMemo only when needed, or read latest values via refs / Effect Events.",
  },
  {
    id: 16,
    slug: "infinite-effect-loop",
    title: "Infinite effect loop",
    mode: "live",
    category: "effects",
    problem:
      "An effect that setStates a value that is also a dependency re-runs forever.",
    solution:
      "Derive during render, compare before setState, or narrow dependencies so updates settle.",
  },
  {
    id: 17,
    slug: "fetch-without-cancel",
    title: "Fetching without cancel / ignore",
    mode: "live",
    category: "effects",
    problem:
      "Slow responses can finish out of order and overwrite newer results (race).",
    solution:
      "AbortController, an ignore flag in cleanup, or a request id so only the latest response applies.",
  },
  {
    id: 18,
    slug: "missing-cleanup",
    title: "Missing effect cleanup",
    mode: "live",
    category: "effects",
    problem:
      "Timers, listeners, and subscriptions keep running after unmount → leaks and setState-on-unmounted warnings.",
    solution:
      "Return a cleanup function from useEffect that clears timers and unsubscribes.",
  },
  {
    id: 19,
    slug: "effect-for-derived-data",
    title: "useEffect to transform / derive data",
    mode: "live",
    category: "effects",
    problem:
      "Syncing derived data with an effect adds an extra render and is easy to get wrong.",
    solution:
      "Compute during render. Effects are for synchronizing with systems outside React.",
  },
  {
    id: 20,
    slug: "effect-for-events",
    title: "useEffect for user events",
    mode: "live",
    category: "effects",
    problem:
      "Reacting to clicks/submits via effects (watching a flag) is indirect and races with other updates.",
    solution:
      "Handle the logic in the event handler itself.",
  },
  {
    id: 21,
    slug: "sync-props-to-state",
    title: "Syncing props to state in an effect",
    mode: "live",
    category: "effects",
    problem:
      "Copying props into state with useEffect creates a second source of truth and extra renders.",
    solution:
      "Use the prop directly, reset with a key, or adjust local state only in response to user input.",
  },
  {
    id: 22,
    slug: "conditional-hooks",
    title: "Conditional or looped Hooks",
    mode: "explain",
    category: "effects",
    problem:
      "Calling Hooks inside if/for breaks the Rules of Hooks; React loses Hook order between renders.",
    solution:
      "Always call Hooks at the top level of your component or custom Hook.",
  },
  {
    id: 23,
    slug: "cargo-cult-memo",
    title: "Cargo-cult useMemo / useCallback",
    mode: "live",
    category: "hooks-memo",
    problem:
      "Wrapping everything in memoization adds noise and can even cost more than it saves.",
    solution:
      "Memoize when you measure a problem or need stable identity for memoized children / deps.",
  },
  {
    id: 24,
    slug: "unstable-inline-props",
    title: "Unstable inline props breaking memo",
    mode: "live",
    category: "hooks-memo",
    problem:
      "New object/array/function props every render defeat React.memo on children.",
    solution:
      "Pass primitives, hoist constants, or memoize the value/callback when the child is memoized.",
  },
  {
    id: 25,
    slug: "component-inside-component",
    title: "Defining components inside components",
    mode: "live",
    category: "hooks-memo",
    problem:
      "An inner component type is new every render, so React remounts it and wipes its state.",
    solution:
      "Declare components at module scope (or pass children / render props).",
  },
  {
    id: 26,
    slug: "wrong-useref",
    title: "Expecting useRef updates to re-render",
    mode: "live",
    category: "hooks-memo",
    problem:
      "Changing ref.current does not trigger a re-render, so the UI stays stale.",
    solution:
      "Use state for values that should appear on screen; refs for imperative/non-visual bookkeeping.",
  },
  {
    id: 27,
    slug: "refs-during-render",
    title: "Reading/writing refs incorrectly during render",
    mode: "explain",
    category: "hooks-memo",
    problem:
      "Writing to refs during render to “fix” purity or mirror props can recreate render-phase bugs.",
    solution:
      "Update refs in effects or event handlers. During render, prefer deriving from props/state.",
  },
  {
    id: 28,
    slug: "custom-hook-not-hook",
    title: "Shared logic that isn’t a custom Hook",
    mode: "explain",
    category: "hooks-memo",
    problem:
      "Helpers that call Hooks but aren’t named use* (or that call Hooks conditionally) break conventions and tooling.",
    solution:
      "Extract Hook-using logic into a function named useSomething and call it unconditionally.",
  },
  {
    id: 29,
    slug: "controlled-uncontrolled-switch",
    title: "Switching controlled ↔ uncontrolled",
    mode: "live",
    category: "forms",
    problem:
      "Starting with value={undefined} then later passing a string makes React warn and input behavior glitch.",
    solution:
      "Pick one mode. For controlled inputs, always pass a defined string (use '' while empty).",
  },
  {
    id: 30,
    slug: "semi-controlled",
    title: "Mixing defaultValue and value",
    mode: "live",
    category: "forms",
    problem:
      "Using both defaultValue and value (or flipping between them) creates a semi-controlled mess.",
    solution:
      "Uncontrolled: defaultValue + refs. Controlled: value + onChange. Don’t mix.",
  },
  {
    id: 31,
    slug: "form-prevent-default",
    title: "Forgetting preventDefault on submit",
    mode: "live",
    category: "forms",
    problem:
      "Native form submit reloads the page and loses React state.",
    solution:
      "Call event.preventDefault() in onSubmit (or use a button type that does not submit).",
  },
  {
    id: 32,
    slug: "stale-closure",
    title: "Stale closure in async handlers",
    mode: "live",
    category: "async-data",
    problem:
      "An async function closes over old state and writes back outdated results after await.",
    solution:
      "Use functional updates, refs for latest values, or abort/ignore so only current work commits.",
  },
  {
    id: 33,
    slug: "ignore-loading-error",
    title: "Ignoring loading and error UI",
    mode: "live",
    category: "async-data",
    problem:
      "Showing nothing (or stale data) while fetching hides failures and feels broken.",
    solution:
      "Model idle/loading/success/error explicitly and render each state.",
  },
  {
    id: 34,
    slug: "waterfall-requests",
    title: "Waterfall requests in effects",
    mode: "live",
    category: "async-data",
    problem:
      "Awaiting request A before starting B when they are independent doubles wait time.",
    solution:
      "Fire independent requests in parallel (Promise.all) unless B truly needs A’s result.",
  },
  {
    id: 35,
    slug: "double-fetch-strict",
    title: "Double-fetch in Strict Mode without a guard",
    mode: "live",
    category: "async-data",
    problem:
      "React 18 Strict Mode remounts in development, so effects fetch twice unless you design for it.",
    solution:
      "Cleanup with AbortController; treat double-invoke as expected in dev, not as production behavior.",
  },
  {
    id: 36,
    slug: "context-identity",
    title: "Context value identity changing every render",
    mode: "live",
    category: "performance",
    problem:
      "value={{ user, setUser }} creates a new object each render and re-renders all consumers.",
    solution:
      "Memoize the context value, or split state/dispatch contexts so readers stay stable.",
  },
  {
    id: 37,
    slug: "giant-context",
    title: "One giant context for unrelated state",
    mode: "explain",
    category: "performance",
    problem:
      "A single app-wide context makes every consumer re-render when any field changes.",
    solution:
      "Split contexts by concern, or colocate state nearer to where it is used.",
  },
  {
    id: 38,
    slug: "prop-drilling",
    title: "Prop drilling as the only tool",
    mode: "explain",
    category: "performance",
    problem:
      "Threading props through many indifferent layers is noisy and brittle (context isn’t always wrong).",
    solution:
      "Use composition (children), context for truly cross-cutting data, or a small store when justified.",
  },
  {
    id: 39,
    slug: "premature-memo",
    title: "Premature React.memo everywhere",
    mode: "explain",
    category: "performance",
    problem:
      "Memoizing every component obscures code and often saves nothing measurable.",
    solution:
      "Profile first. Memoize hot leaves that receive stable props, not the entire tree by default.",
  },
  {
    id: 40,
    slug: "heavy-work-no-deferral",
    title: "Heavy work in render without deferral",
    mode: "live",
    category: "performance",
    problem:
      "Expensive synchronous work on every keystroke blocks typing and feels janky.",
    solution:
      "useDeferredValue or startTransition so urgent input stays responsive while heavy UI catches up.",
  },
  {
    id: 41,
    slug: "inheritance-over-composition",
    title: "Inheritance over composition",
    mode: "explain",
    category: "composition",
    problem:
      "Subclassing components couples lifecycles and fights the React model.",
    solution:
      "Compose with props and children (and hooks for reusable behavior).",
  },
  {
    id: 42,
    slug: "prop-spreading-dom",
    title: "Blind prop spreading onto the DOM",
    mode: "live",
    category: "composition",
    problem:
      "Spreading custom props onto a DOM node leaks invalid attributes and non-DOM handlers.",
    solution:
      "Destructure known props; only forward DOM-safe rest props intentionally.",
  },
  {
    id: 43,
    slug: "boolean-props-api",
    title: "Unclear boolean / string prop APIs",
    mode: "explain",
    category: "composition",
    problem:
      "APIs like isActive=\"false\" (string) or overlapping flags make components hard to use correctly.",
    solution:
      "Prefer real booleans, enums, or discriminated variants with TypeScript.",
  },
  {
    id: 44,
    slug: "hoc-soup",
    title: "Deep HOC / render-prop nesting",
    mode: "explain",
    category: "composition",
    problem:
      "Wrapper pyramids obscure props, hurt types, and make debugging painful.",
    solution:
      "Prefer custom hooks and simple composition; keep HOCs rare and shallow.",
  },
  {
    id: 45,
    slug: "business-logic-in-components",
    title: "All business logic only in components",
    mode: "explain",
    category: "composition",
    problem:
      "Fat components that own rules, I/O, and UI are hard to test and reuse.",
    solution:
      "Extract pure functions and hooks; keep components focused on rendering and wiring.",
  },
  {
    id: 46,
    slug: "direct-dom-manipulation",
    title: "Direct DOM manipulation instead of state",
    mode: "live",
    category: "dom-legacy",
    problem:
      "querySelector + imperative updates fight React’s ownership of the DOM and get wiped on re-render.",
    solution:
      "Drive the UI from state/props. Use refs only for focus, measurements, and non-React APIs.",
  },
  {
    id: 47,
    slug: "finddomnode-string-refs",
    title: "findDOMNode and string refs",
    mode: "explain",
    category: "dom-legacy",
    problem:
      "Legacy ref APIs are removed or unsupported in modern React and concurrent features.",
    solution:
      "Use callback refs or useRef objects created with createRef/useRef.",
  },
  {
    id: 48,
    slug: "unsafe-innerhtml",
    title: "Unsafe innerHTML without sanitization",
    mode: "live",
    category: "dom-legacy",
    problem:
      "dangerouslySetInnerHTML with untrusted strings enables XSS.",
    solution:
      "Prefer text nodes. If HTML is required, sanitize with a trusted library and a strict allowlist.",
  },
  {
    id: 49,
    slug: "clickable-div",
    title: "Clickable div instead of button",
    mode: "live",
    category: "a11y",
    problem:
      "Divs with onClick are not keyboard-accessible by default and confuse assistive tech.",
    solution:
      "Use <button> (or a link). If you must use a non-button, add role, tabIndex, and key handlers.",
  },
  {
    id: 50,
    slug: "broken-label",
    title: "Broken label ↔ input association",
    mode: "live",
    category: "a11y",
    problem:
      "A label that is not linked via htmlFor/id (or wrapping) does not focus the control and fails a11y checks.",
    solution:
      "Associate labels with htmlFor matching the input id, or wrap the input in the label.",
  },
];

export function getCategory(id: MistakeCategoryId): MistakeCategory | undefined {
  return categories.find((c) => c.id === id);
}

export function getMistake(slug: string): Mistake | undefined {
  return mistakes.find((m) => m.slug === slug);
}

export function getMistakesByCategory(): {
  category: MistakeCategory;
  items: Mistake[];
}[] {
  return categories
    .map((category) => ({
      category,
      items: mistakes.filter((m) => m.category === category.id),
    }))
    .filter((g) => g.items.length > 0);
}
