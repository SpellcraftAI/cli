import which from "which";
import { createShell } from "await-shell";
import { logDim, success } from "../lib/utils/log";

export const updateCommand = async () => {
  const yarnPath = which.sync("yarn", { nothrow: true });
  const npmPath = which.sync("npm", { nothrow: true });

  if (!yarnPath && !npmPath) {
    throw new Error("Neither NPM nor Yarn found in PATH.");
  }

  const shell = createShell();

  if (yarnPath) {
    logDim("Checking for updates with Yarn...");
    await shell.run("yarn global add @upg/cli");
  } else {
    logDim("Checking for updates with NPM...");
    await shell.run("npm i -g @upg/cli");
  }

  success("Updated successfully.");
};