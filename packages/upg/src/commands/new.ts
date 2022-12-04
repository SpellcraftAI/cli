/* eslint-disable no-console */
import { stdout } from "process";
import { newProgram } from "../actions/new";
import { loop } from "../state";

export type NewOptions = {
  target: string;
  nonInteractive?: boolean;
};

export const newCommand = async (
  target: string,
  description: string,
  {
    nonInteractive = false,
  }: NewOptions
) => {
  if (!description || !target) {
    if (nonInteractive) {
      throw new Error("Specify `prompt` and `target` for --non-interactive mode.");
    }
  }

  const initialState = await newProgram({ code: "", target }, { prompt: description });
  if (!initialState || !initialState.code) {
    throw new Error("No code generated.");
  }

  if (!nonInteractive) {
    // displayProgram({ code: initialState.code, target });
    await loop(initialState);
  } else {
    stdout.write(initialState.code.trim());
  }
};