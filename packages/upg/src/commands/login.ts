import { error, success } from "@tsmodule/log";
import { AUTH0_CLIENT } from "../globs/node";

export const loginCommand = async () => {
  try {
    await AUTH0_CLIENT.login();
    success("Logged in.");
  } catch (e) {
    error("Failed to log in.");
    throw e;
  }
};