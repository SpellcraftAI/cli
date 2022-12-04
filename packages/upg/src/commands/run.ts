import { readFile } from "fs/promises";
import { extname } from "path";
import { run } from "../actions/run";
import { PROCESS_PIPED_STDIN } from "../bin";
import { loop } from "../state";

export type RunOptions = {
  nonInteractive?: boolean;
  target?: string;
};

export const runCommand = async (
  file?: string,
  { nonInteractive = false, target }: RunOptions = {}
) => {
  if (PROCESS_PIPED_STDIN) {
    if (!target) {
      throw new Error("Specify `target` when piping stdin.");
    }

    await run ({ code: PROCESS_PIPED_STDIN, target });
    return;
  }

  if (!file) {
    throw new Error("Specify `file` for --non-interactive mode.");
  }

  target = target || extname(file).slice(1);
  const fileContents = await readFile(file, "utf8");
  const state = await run({ code: fileContents, target });

  if (!nonInteractive) {
    await loop(state);
  }
};