import { AUTH0_CLIENT } from "../globs/node";
import { chalk } from "../globs/shared";

import { error, success } from "../utils/log";

export const loginCommand = async () => {
  try {
    const user = await AUTH0_CLIENT.login();
    success(`Logged in as ${chalk.underline(user.email)}.`);
  } catch (e) {
    error("Failed to log in.");
    throw e;
  }
};