import type { ReactNode } from "react";
import * as state from "../demos/state";
import * as lists from "../demos/lists";
import * as effects from "../demos/effects";
import * as hooks from "../demos/hooks";
import * as forms from "../demos/forms";
import * as asyncDemos from "../demos/async";
import * as performance from "../demos/performance";
import * as dom from "../demos/dom";
import * as explain from "../demos/explain";

export type DemoPair = {
  wrong: ReactNode;
  right: ReactNode;
};

type DemoModule = {
  Wrong: () => ReactNode;
  Right: () => ReactNode;
};

function pair(mod: DemoModule): DemoPair {
  return {
    wrong: <mod.Wrong />,
    right: <mod.Right />,
  };
}

export const registry: Record<string, DemoPair> = {
  "mutating-state": pair({
    Wrong: state.MutatingStateWrong,
    Right: state.MutatingStateRight,
  }),
  "mutating-props": pair({
    Wrong: state.MutatingPropsWrong,
    Right: state.MutatingPropsRight,
  }),
  "derived-state": pair({
    Wrong: state.DerivedStateWrong,
    Right: state.DerivedStateRight,
  }),
  "side-effects-in-render": pair({
    Wrong: state.SideEffectsInRenderWrong,
    Right: state.SideEffectsInRenderRight,
  }),
  "setstate-in-render": pair({
    Wrong: state.SetStateInRenderWrong,
    Right: state.SetStateInRenderRight,
  }),
  "impure-render": pair({
    Wrong: state.ImpureRenderWrong,
    Right: state.ImpureRenderRight,
  }),
  "state-vs-ref": pair({
    Wrong: state.StateVsRefWrong,
    Right: state.StateVsRefRight,
  }),
  "lifting-state": pair({
    Wrong: explain.LiftingStateWrong,
    Right: explain.LiftingStateRight,
  }),
  "reset-state-with-key": pair({
    Wrong: state.ResetStateWrong,
    Right: state.ResetStateRight,
  }),
  "missing-keys": pair({
    Wrong: lists.MissingKeysWrong,
    Right: lists.MissingKeysRight,
  }),
  "index-as-key": pair({
    Wrong: lists.IndexAsKeyWrong,
    Right: lists.IndexAsKeyRight,
  }),
  "unstable-keys": pair({
    Wrong: lists.UnstableKeysWrong,
    Right: lists.UnstableKeysRight,
  }),
  "key-on-wrong-element": pair({
    Wrong: lists.KeyOnWrongElementWrong,
    Right: lists.KeyOnWrongElementRight,
  }),
  "missing-effect-deps": pair({
    Wrong: effects.MissingEffectDepsWrong,
    Right: effects.MissingEffectDepsRight,
  }),
  "over-specifying-deps": pair({
    Wrong: explain.OverSpecifyingDepsWrong,
    Right: explain.OverSpecifyingDepsRight,
  }),
  "infinite-effect-loop": pair({
    Wrong: effects.InfiniteEffectLoopWrong,
    Right: effects.InfiniteEffectLoopRight,
  }),
  "fetch-without-cancel": pair({
    Wrong: effects.FetchWithoutCancelWrong,
    Right: effects.FetchWithoutCancelRight,
  }),
  "missing-cleanup": pair({
    Wrong: effects.MissingCleanupWrong,
    Right: effects.MissingCleanupRight,
  }),
  "effect-for-derived-data": pair({
    Wrong: effects.EffectForDerivedWrong,
    Right: effects.EffectForDerivedRight,
  }),
  "effect-for-events": pair({
    Wrong: effects.EffectForEventsWrong,
    Right: effects.EffectForEventsRight,
  }),
  "sync-props-to-state": pair({
    Wrong: effects.SyncPropsToStateWrong,
    Right: effects.SyncPropsToStateRight,
  }),
  "conditional-hooks": pair({
    Wrong: explain.ConditionalHooksWrong,
    Right: explain.ConditionalHooksRight,
  }),
  "cargo-cult-memo": pair({
    Wrong: hooks.CargoCultMemoWrong,
    Right: hooks.CargoCultMemoRight,
  }),
  "unstable-inline-props": pair({
    Wrong: hooks.UnstableInlinePropsWrong,
    Right: hooks.UnstableInlinePropsRight,
  }),
  "component-inside-component": pair({
    Wrong: hooks.ComponentInsideWrong,
    Right: hooks.ComponentInsideRight,
  }),
  "wrong-useref": pair({
    Wrong: hooks.WrongUseRefWrong,
    Right: hooks.WrongUseRefRight,
  }),
  "refs-during-render": pair({
    Wrong: explain.RefsDuringRenderWrong,
    Right: explain.RefsDuringRenderRight,
  }),
  "custom-hook-not-hook": pair({
    Wrong: explain.CustomHookNotHookWrong,
    Right: explain.CustomHookNotHookRight,
  }),
  "controlled-uncontrolled-switch": pair({
    Wrong: forms.ControlledSwitchWrong,
    Right: forms.ControlledSwitchRight,
  }),
  "semi-controlled": pair({
    Wrong: forms.SemiControlledWrong,
    Right: forms.SemiControlledRight,
  }),
  "form-prevent-default": pair({
    Wrong: forms.FormPreventDefaultWrong,
    Right: forms.FormPreventDefaultRight,
  }),
  "stale-closure": pair({
    Wrong: asyncDemos.StaleClosureWrong,
    Right: asyncDemos.StaleClosureRight,
  }),
  "ignore-loading-error": pair({
    Wrong: asyncDemos.IgnoreLoadingWrong,
    Right: asyncDemos.IgnoreLoadingRight,
  }),
  "waterfall-requests": pair({
    Wrong: asyncDemos.WaterfallWrong,
    Right: asyncDemos.WaterfallRight,
  }),
  "double-fetch-strict": pair({
    Wrong: asyncDemos.DoubleFetchWrong,
    Right: asyncDemos.DoubleFetchRight,
  }),
  "context-identity": pair({
    Wrong: performance.ContextIdentityWrong,
    Right: performance.ContextIdentityRight,
  }),
  "giant-context": pair({
    Wrong: explain.GiantContextWrong,
    Right: explain.GiantContextRight,
  }),
  "prop-drilling": pair({
    Wrong: explain.PropDrillingWrong,
    Right: explain.PropDrillingRight,
  }),
  "premature-memo": pair({
    Wrong: explain.PrematureMemoWrong,
    Right: explain.PrematureMemoRight,
  }),
  "heavy-work-no-deferral": pair({
    Wrong: performance.HeavyWorkWrong,
    Right: performance.HeavyWorkRight,
  }),
  "inheritance-over-composition": pair({
    Wrong: explain.InheritanceWrong,
    Right: explain.InheritanceRight,
  }),
  "prop-spreading-dom": pair({
    Wrong: performance.PropSpreadingWrong,
    Right: performance.PropSpreadingRight,
  }),
  "boolean-props-api": pair({
    Wrong: explain.BooleanPropsWrong,
    Right: explain.BooleanPropsRight,
  }),
  "hoc-soup": pair({
    Wrong: explain.HocSoupWrong,
    Right: explain.HocSoupRight,
  }),
  "business-logic-in-components": pair({
    Wrong: explain.BusinessLogicWrong,
    Right: explain.BusinessLogicRight,
  }),
  "direct-dom-manipulation": pair({
    Wrong: dom.DirectDomWrong,
    Right: dom.DirectDomRight,
  }),
  "finddomnode-string-refs": pair({
    Wrong: explain.FindDomNodeWrong,
    Right: explain.FindDomNodeRight,
  }),
  "unsafe-innerhtml": pair({
    Wrong: dom.UnsafeInnerHtmlWrong,
    Right: dom.UnsafeInnerHtmlRight,
  }),
  "clickable-div": pair({
    Wrong: dom.ClickableDivWrong,
    Right: dom.ClickableDivRight,
  }),
  "broken-label": pair({
    Wrong: dom.BrokenLabelWrong,
    Right: dom.BrokenLabelRight,
  }),
};

export function getDemo(slug: string): DemoPair | undefined {
  return registry[slug];
}
