import { DOMAIN_URL } from "../globs/shared";

import prompts from "prompts";

import { diffLines } from "diff";
import { success } from "../utils/log";
import { NullableAction } from "./types";
import { AUTH0_CLIENT } from "../globs/node";

export const edit: NullableAction = async (state) => {
  if (!state || !state.code) {
    throw new Error("Nothing to edit.");
  }

  const { code } = state;
  const { instruction } = await prompts({
    type: "text",
    name: "instruction",
    message: "How should this program should be changed?",
  });

  const body = new URLSearchParams({ code, instruction });
  const response = await AUTH0_CLIENT.fetch(
    `${DOMAIN_URL}/api/edit`,
    {
      method: "POST",
      body,
    }
  ).then((res) => res.json()) as any;

  if (typeof response.code !== "string") {
    throw new Error("No code generated.");
  }

  const editedCode = response.code.trim();
  const diff = diffLines(code, editedCode);

  success("Edited.");
  return {
    ...state,
    code: editedCode,
    diff,
  };
};