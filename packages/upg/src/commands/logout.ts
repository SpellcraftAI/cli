import { AUTH0_CLIENT } from "../globs/node";
import { success } from "../utils/log";

export const logoutCommand = async () => {
  await AUTH0_CLIENT.logout();
  success("Logged out successfully.");
};