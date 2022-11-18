import { DEFAULT_SHELL, DOMAIN_URL } from "../globs/shared";
import prompts from "prompts";

import { Action } from "./types";
import { AUTH0_CLIENT } from "../globs/node";

export const newProgram: Action<{ prompt?: string }> = async (
  state,
  { prompt } = {}
) => {
  let target: string | undefined;
  if (state) {
    target = state.target;
  }

  if (!target) {
    const { language }  = await prompts({
      type: "text",
      name: "language",
      message: "What language is this program written in?",
      initial: DEFAULT_SHELL,
      hint: "Example: 'TypeScript'",
    });

    if (!language) {
      throw new Error("No language provided.");
    }

    target = language;
  }

  if (!prompt) {

    // const description = await new Promise((resolve, reject) => {
    //   editor("Testing")
    //     .on("submit", resolve)
    //     .on("abort", reject);
    // });

    const { description } = await prompts({
      type: "text",
      name: "description",
      message: "What will this program do?",
      hint: "Example: 'define a function fibonacci(n: number): number that returns the nth fibonacci number.'",
    });

    if (!description) {
      throw new Error("No description provided.");
    }

    prompt = description;
  }

  /**
   * "ts" and "js" are aliases for "typescript" and "javascript".
   */
  if (target === "ts") {
    target = "typescript";
  } else if (target === "js") {
    target = "javascript";
  }

  if (!prompt) {
    throw new Error("Failed to load prompt.");
  }

  if (!target) {
    throw new Error("Failed to load target.");
  }

  const body = new URLSearchParams({ prompt, target });
  const requestUrl = `${DOMAIN_URL}/api/generate`;

  const response = await AUTH0_CLIENT.fetch(
    requestUrl,
    {
      method: "POST",
      body,
    }
  ).then(
    (res) => res.json()
  ) as any;

  const { code, error } = response;

  if (error) {
    throw new Error(error);
  }

  if (typeof code !== "string") {
    throw new Error("No code generated.");
  }

  if (typeof target !== "string") {
    throw new Error("No valid target detected.");
  }

  return {
    code,
    target,
  };
};