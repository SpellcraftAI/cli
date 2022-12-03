import { success } from "@tsmodule/log";
import { AUTH0_CLIENT } from "../globs/node";

export const logoutCommand = async () => {
  await AUTH0_CLIENT.logout();
  success("Logged out successfully.");
};