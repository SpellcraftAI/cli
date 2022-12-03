import which from "which";
import { createShell } from "universal-shell";
import { createDebugLogger } from "debug-logging";

import { log, success } from "@tsmodule/log";
import { CANARY, VERSION } from "../globs/shared";

export const updateCommand = async () => {
  const DEBUG = createDebugLogger(updateCommand);
  const packageName = CANARY ? "@gptlabs/upg@canary" : "@gptlabs/upg";

  if (CANARY) {
    log("Installing canary version.");
  }

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
      try {
        await shell.run(`npm uninstall -g ${packageName}`);
      } catch (e) {
        DEBUG.log("No NPM copy found.");
      }
    }

    log("Updating upg via Yarn.", ["bold"]);
    await shell.run(`yarn global add ${packageName}`);
  } else {
    if (yarnPath) {
      log("upg installed via NPM. Ensuring no Yarn copy.", ["bold"]);
      try {
        await shell.run(`yarn global remove ${packageName}`);
      } catch (e) {
        DEBUG.log("No Yarn copy found.");
      }
    }

    log("Updating upg via NPM.", ["bold"]);
    await shell.run(`npm i -g ${packageName} --save`);
  }

  success("Updated successfully.");
};