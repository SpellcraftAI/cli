import { AUTH0_CLIENT } from "../lib/globs/node";
import { chalk } from "../lib/globs/shared";
import { error, success } from "../lib/utils/log";

export const loginCommand = async () => {
  try {
    const user = await AUTH0_CLIENT.login();
    success(`Logged in as ${chalk.underline(user.email)}.`);
  } catch (e) {
    error("Failed to log in.");
    throw e;
  }
};