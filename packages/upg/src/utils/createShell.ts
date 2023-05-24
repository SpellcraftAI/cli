import { CreateShellOptions, createShell as createUniversalShell } from "universal-shell";

export const createShell = async (options: CreateShellOptions) => {
  return await createUniversalShell(options);
};