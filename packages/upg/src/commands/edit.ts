import { readFile } from "fs/promises";
import { extname } from "path";

import { edit } from "../lib/actions/edit";
import { loop, State } from "../lib/state";
import { displayProgram } from "../lib/utils/displayProgram";

/**
 * Edit code from a file.
 */
export const editCommand = async (file: string) => {
  const target = extname(file).slice(1);
  const fileContents = await readFile(file, "utf8");

  displayProgram({ code: fileContents, target });

  const initialState: State = {
    target,
    code: fileContents,
    file,
  };

  const edited = await edit(initialState);
  if (!edited) {
    throw new Error("No code generated.");
  }

  const finalState = await loop(edited);
  return finalState?.code;
};
