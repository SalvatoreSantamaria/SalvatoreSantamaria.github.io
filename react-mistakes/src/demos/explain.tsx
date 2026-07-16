import { ExplainPanel } from "../components/ExplainPanel";

export function LiftingStateWrong() {
  return (
    <ExplainPanel summary="State too high re-renders indifferent siblings; too low blocks sharing. See the annotated wrong code below." />
  );
}

export function LiftingStateRight() {
  return (
    <ExplainPanel summary="Lift to the nearest common ancestor that truly needs the data; keep unrelated trees free. See the annotated right code below." />
  );
}

export function OverSpecifyingDepsWrong() {
  return (
    <ExplainPanel summary="Unstable objects/functions in dependency arrays retrigger effects every render. See the annotated wrong code below." />
  );
}

export function OverSpecifyingDepsRight() {
  return (
    <ExplainPanel summary="Depend on primitives, or memoize when identity matters. See the annotated right code below." />
  );
}

export function ConditionalHooksWrong() {
  return (
    <ExplainPanel summary="Hooks must be called in the same order every render. Conditionals/loops break that contract. See the annotated wrong code below." />
  );
}

export function ConditionalHooksRight() {
  return (
    <ExplainPanel summary="Always call Hooks at the top level; put conditions inside the effect body. See the annotated right code below." />
  );
}

export function RefsDuringRenderWrong() {
  return (
    <ExplainPanel summary="Using refs as a substitute for values that should paint recreates render-phase bugs. See the annotated wrong code below." />
  );
}

export function RefsDuringRenderRight() {
  return (
    <ExplainPanel summary="Derive values for display; reserve refs for non-visual or imperative bookkeeping. See the annotated right code below." />
  );
}

export function CustomHookNotHookWrong() {
  return (
    <ExplainPanel summary="Helpers that call Hooks must be custom Hooks (use* name) and called unconditionally. See the annotated wrong code below." />
  );
}

export function CustomHookNotHookRight() {
  return (
    <ExplainPanel summary="Extract Hook-using logic into useSomething and call it from components. See the annotated right code below." />
  );
}

export function GiantContextWrong() {
  return (
    <ExplainPanel summary="One mega-context forces wide re-renders whenever any field changes. See the annotated wrong code below." />
  );
}

export function GiantContextRight() {
  return (
    <ExplainPanel summary="Split contexts by concern so updates stay local. See the annotated right code below." />
  );
}

export function PropDrillingWrong() {
  return (
    <ExplainPanel summary="Threading props through many layers that do not use them is noisy. See the annotated wrong code below." />
  );
}

export function PropDrillingRight() {
  return (
    <ExplainPanel summary="Use composition or context for truly cross-cutting data. See the annotated right code below." />
  );
}

export function PrematureMemoWrong() {
  return (
    <ExplainPanel summary="Memoizing everything obscures intent and often saves nothing measurable. See the annotated wrong code below." />
  );
}

export function PrematureMemoRight() {
  return (
    <ExplainPanel summary="Profile first. Memoize hot leaves that receive stable props. See the annotated right code below." />
  );
}

export function InheritanceWrong() {
  return (
    <ExplainPanel summary="Subclassing components couples lifecycles and fights the React model. See the annotated wrong code below." />
  );
}

export function InheritanceRight() {
  return (
    <ExplainPanel summary="Compose with props and children (and hooks for reusable behavior). See the annotated right code below." />
  );
}

export function BooleanPropsWrong() {
  return (
    <ExplainPanel summary="Stringly-typed flags and overlapping booleans make APIs easy to misuse. See the annotated wrong code below." />
  );
}

export function BooleanPropsRight() {
  return (
    <ExplainPanel summary="Prefer real booleans, enums, or discriminated variants. See the annotated right code below." />
  );
}

export function HocSoupWrong() {
  return (
    <ExplainPanel summary="Deep HOC pyramids obscure props and hurt TypeScript / debugging. See the annotated wrong code below." />
  );
}

export function HocSoupRight() {
  return (
    <ExplainPanel summary="Prefer custom hooks and simple composition. See the annotated right code below." />
  );
}

export function BusinessLogicWrong() {
  return (
    <ExplainPanel summary="Components that own rules, I/O, and UI are hard to test. See the annotated wrong code below." />
  );
}

export function BusinessLogicRight() {
  return (
    <ExplainPanel summary="Extract pure functions and hooks; keep components focused on rendering. See the annotated right code below." />
  );
}

export function FindDomNodeWrong() {
  return (
    <ExplainPanel summary="findDOMNode and string refs are legacy and incompatible with modern React. See the annotated wrong code below." />
  );
}

export function FindDomNodeRight() {
  return (
    <ExplainPanel summary="Use callback refs or useRef objects. See the annotated right code below." />
  );
}
