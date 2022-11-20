import which from "which";
import { createShell } from "await-shell";

import { log, success } from "../utils/log";
import { chalk } from "../globs/shared";

export const updateCommand = async () => {
  const yarnPath = which.sync("yarn", { nothrow: true });
  const npmPath = which.sync("npm", { nothrow: true });
  const upgPath = which.sync("upg", { nothrow: true });

  if (!yarnPath && !npmPath) {
    throw new Error("Neither NPM nor Yarn found in PATH.");
  }

  if (!upgPath) {
    throw new Error("upg not found in PATH.");
  }

  const shell = createShell();

  if (upgPath.includes("yarn")) {
    if (npmPath) {
      log(chalk.bold("upg installed via Yarn. Ensuring no NPM copy."));
      await shell.run("npm uninstall -g @gptlabs/upg");
    }

    log(chalk.bold("Updating upg via Yarn."));
    await shell.run("yarn global add @gptlabs/upg");
  } else {
    if (yarnPath) {
      log(chalk.bold("upg installed via NPM. Ensuring no Yarn copy."));
      await shell.run("yarn global remove @gptlabs/upg");
    }
  }

  success("Updated successfully.");
};