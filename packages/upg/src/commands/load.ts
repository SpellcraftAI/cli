import { readFile } from "fs/promises";
import { extname } from "path";

import { loop, State } from "../state";

/**
 * Edit code from a file.
 */
export const loadCommand = async (file: string) => {
  const target = extname(file).slice(1);
  const fileContents = await readFile(file, "utf8");

  const initialState: State = {
    target,
    code: fileContents,
    file,
  };

  const finalState = await loop(initialState);
  return finalState?.code;
};
