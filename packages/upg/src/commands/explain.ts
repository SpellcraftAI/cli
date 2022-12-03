// @ts-ignore - No types
import editor from "tiny-cli-editor";
import prompts from "prompts";
import { explain } from "../actions/explain";
import { loop } from "../state";
import { log } from "@tsmodule/log";
import {extname} from "path";
import {readFile} from "fs/promises";

export type ExplainOptions = {
  nonInteractive?: boolean;
};

export const explainCommand = async (
  file: string,
  { nonInteractive = false }: ExplainOptions
) => {
  if (nonInteractive) {
    if (!file) {
      throw new Error("Specify `file` for --non-interactive mode.");
    }
    const target = extname(file).slice(1);
    const fileContents = await readFile(file, "utf8");
    const state = await explain({ code: fileContents, target });
    log(state.explanation);
    return;
  }

  const code: string = await new Promise((resolve, reject) => {
    editor("")
      .on("submit", resolve)
      .on("abort", reject);
  });

  log("Loading...");
  const initialState = await explain({ code });
  // eslint-disable-next-line no-console
  console.clear();

  const { target } = await prompts({
    type: "text",
    name: "target",
    message: "What language is this program written in?",
  });

  await loop({
    ...initialState,
    target,
  });
};