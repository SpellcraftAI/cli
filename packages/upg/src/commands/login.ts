import { error, warn, } from "@tsmodule/log";
import { AUTH0_CLIENT } from "../globs/node";

export const loginCommand = async () => {
  try {
    await AUTH0_CLIENT.login();
    warn("Logged in.", ["bold", "green"], { preLines: 1 });
  } catch (e) {
    error("Failed to log in.");
    throw e;
  }
};