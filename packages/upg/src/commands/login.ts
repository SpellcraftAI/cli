import { error, style, success } from "@tsmodule/log";
import { AUTH0_CLIENT } from "../globs/node";

export const loginCommand = async () => {
  try {
    const user = await AUTH0_CLIENT.login();
    success(`Logged in as ${style(user.email, ["underline"])}.`);
  } catch (e) {
    error("Failed to log in.");
    throw e;
  }
};