import { DOMAIN_URL } from "../globs/shared";
import { Action } from "./types";
import { AUTH0_CLIENT } from "../globs/node";

export const explain: Action = async (state) => {
  if (!state || !state.code) {
    throw new Error("Nothing to explain.");
  }

  const { code } = state;

  const body = new URLSearchParams({ code });
  const response = await AUTH0_CLIENT.fetch(
    `${DOMAIN_URL}/api/explain`,
    {
      method: "POST",
      body: body,
    }
  ).then((res) => res.json()) as any;

  if (typeof response.explanation !== "string") {
    throw new Error("No explanation generated.");
  }

  const explanation: string = response.explanation.trim();

  return {
    ...state,
    explanation,
  };
};