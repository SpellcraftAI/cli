// @ts-ignore - No types
import editor from "tiny-cli-editor";
import prompts from "prompts";
import { explain } from "../lib/actions/explain";
import { loop } from "../lib/state";
import { log } from "../lib/utils/log";

export const explainCommand = async () => {
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