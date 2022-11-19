import { State } from "./types";

import { chalk } from "../globs/shared";
import { error, log } from "../utils/log";
import { displayProgram } from "../utils/displayProgram";
import { nextState } from "./next";

export const loop = async (
  initialState: State,
): Promise<State | null> => {
  const stack: State[] = [initialState];
  let stackIndex = 0;
  let current: State;

  while (true) {
    current = stack[stackIndex] || null;
    if (!current) {
      break;
    }

    if (current.explanation) {
      log(chalk.dim(chalk.bold("Explanation")), current.explanation);
    }

    displayProgram(current);

    if (!current?.code) {
      error("Warning: Empty program. Reverting.");

      stack.pop();
      stackIndex--;
      continue;
    }

    const { next, done, undo } = await nextState(current);

    if (done) {
      break;
    } else if (undo) {
      stack.pop();
      stackIndex--;
    } else if (next) {
      stack.push(next);
      stackIndex++;
    }
  }

  return current;
};