import { State } from "../state";

/**
 * Accepts a state and returns a new state, or `null` if the action does not
 * affect the current state.
 */
export type NullableAction<T = never> = (
  state: State | null,
  options?: T
) => Promise<State | null>;

/**
 * Accepts a state and returns a new state. Guaranteed to return a state.
 */
export type Action<T = never> = (
  state: State | null,
  options?: T
) => Promise<State>;