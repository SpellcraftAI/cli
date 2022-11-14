
import { edit } from "./actions/edit";
import { run } from "./actions/run";
import { save } from "./actions/save";
import { error, log, success } from "./utils/log";
import { displayProgram } from "./utils/displayProgram";

import clipboard from "clipboardy";
import prompts from "prompts";
import { Change } from "diff";
import { newProgram } from "./actions/new";
import chalk from "chalk";


export type State = {
  code: string;
  target?: string;
  file?: string;
  diff?: Change[];
  explanation?: string;
};


export const nextState = async (current: State) => {
  let next: State | null = null;

  const { action } = await prompts({
    type: "select",
    name: "action",
    message: "What would you like to do?",
    initial: 1,
    choices: [
      {
        title: "New",
        value: "new",
        description: "Create a new program.",
      },
      {
        title: "Edit",
        value: "edit",
        description: "Edit this program.",
        selected: true,
      },
      {
        title: "Run",
        value: "run",
        description: "Run this program.",
      },
      {
        title: "Copy",
        value: "copy",
        description: "Copy this program to your clipboard.",
      },
      {
        title: "Save",
        value: "save",
        description: "Write this edit back to the file.",
      },
      {
        title: "Undo",
        value: "undo",
        description: "Undo this edit and revert to previous version.",
      },
      {
        title: "Exit",
        value: "exit",
        description: "Discard all changes and exit.",
      },
    ],
  });

  let undo = false;
  let done = false;

  switch (action) {
    case "new":
      const program = await newProgram(null);
      next = program;
      break;

    case "edit":
      if (!current.code) {
        throw new Error("No code to edit.");
      }

      const edited = await edit(current);
      next = {
        ...current,
        ...edited,
      };
      break;

    case "run":
      await run(current);
      break;

    case "copy":
      if (!current.code) {
        throw new Error("No code to copy.");
      }

      await clipboard.write(current.code);
      success("Copied.");
      break;

    case "save":
      await save(current);
      break;

    case "undo":
      success("Reverting.");
      undo = true;
      break;

    case "exit":
      done = true;
      break;

    default:
      done = true;
      break;
  }

  if (next) {
    next.code = next.code?.trim();
  }

  return {
    next,
    done,
    undo,
  };
};


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
