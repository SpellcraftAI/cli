import which from "which";
import { createShell } from "universal-shell";

import { log, success } from "@tsmodule/log";

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
      log("upg installed via Yarn. Ensuring no NPM copy.", ["bold"]);
      await shell.run("npm uninstall -g @gptlabs/upg");
    }

    log("Updating upg via Yarn.", ["bold"]);
    await shell.run("yarn global add @gptlabs/upg");
  } else {
    if (yarnPath) {
      log("upg installed via NPM. Ensuring no Yarn copy.", ["bold"]);
      await shell.run("yarn global remove @gptlabs/upg");
    }

    log("Updating upg via NPM.", ["bold"]);
    await shell.run("npm update -g @gptlabs/upg");
  }

  success("Updated successfully.");
};