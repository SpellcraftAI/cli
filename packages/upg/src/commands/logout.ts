import { AUTH0_CLIENT } from "../lib/globs/node";
import { success } from "../lib/utils/log";

export const logoutCommand = async () => {
  await AUTH0_CLIENT.logout();
  success("Logged out successfully.");
};