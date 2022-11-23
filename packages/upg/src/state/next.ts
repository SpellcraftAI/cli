import clipboard from "clipboardy";
import prompts from "prompts";

import { NextState, State } from "./types";

import { edit } from "../actions/edit";
import { run } from "../actions/run";
import { save } from "../actions/save";
import { newProgram } from "../actions/new";
import { explain } from "../actions/explain";

import { displayProgram } from "../utils/displayProgram";
import { log, success } from "@tsmodule/log";

export const nextState = async (current: State): Promise<NextState> => {
  let next: State | null = null;

  if (current?.lastRun?.exitCode !== 0 && current?.lastRun?.stderr) {
    const { autofix } = await prompts({
      type: "confirm",
      name: "autofix",
      message: "The last run failed. Would you like to autofix?",
    });

    if (autofix) {
      const autofixPrompt = `fix errors from stderr:\n\n${current.lastRun.stderr}`;
      const edited = await edit(current, { instruction: autofixPrompt });

      if (edited) {
        displayProgram({ code: edited.code, target: edited.target });

        const { runAgain } = await prompts({
          type: "confirm",
          name: "runAgain",
          message: "Would you like to run this fix?",
        });

        if (runAgain) {
          next = await run(edited);
        }
      }

      return {
        next,
        done: false,
        undo: false,
      };
    }
  }

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
        title: "Explain",
        value: "explain",
        description: "Explain what this program does.",
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
      next = await newProgram(null);
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

    case "explain":
      if (!current.code) {
        throw new Error("No code to explain.");
      }

      next = await explain(current);
      break;

    case "run":
      next = await run(current);
      break;

    case "copy":
      if (!current.code) {
        throw new Error("No code to copy.");
      }

      await clipboard.write(current.code);
      log();
      success("Copied.");
      break;

    case "save":
      await save(current);
      break;

    case "undo":
      log();
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



