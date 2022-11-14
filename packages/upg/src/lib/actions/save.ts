import prompts from "prompts";

import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path";

import { success } from "../utils/log";
import { NullableAction } from "./types";

export const save: NullableAction<string | undefined> = async (state) => {
  if (!state || !state.code) {
    throw new Error("Nothing to save.");
  }

  const { code } = state;
  let { file } = state;

  if (!file) {
    const { filename: promptFilename } = await prompts({
      type: "text",
      name: "filename",
      message: "Enter a path to save the file to, e.g. 'src/fibonacci.ts'",
    });

    file = promptFilename;
    if (!file) {
      throw new Error("No filename provided.");
    }
  }

  const dir = dirname(file);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  await writeFile(file, code);

  success(`Saved file to ${file}.`);
  return null;
};