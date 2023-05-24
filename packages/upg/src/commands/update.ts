import which from "which";
import { createShell } from "../utils/createShell";
import { createDebugLogger } from "debug-logging";

import { log, success } from "@tsmodule/log";
import { CANARY } from "../globs/shared";

export const updateCommand = async () => {
  const DEBUG = createDebugLogger(updateCommand);
  const packageName = CANARY ? "@gptlabs/upg@canary" : "@gptlabs/upg";

  if (CANARY) {
    log("Installing canary version.");
  }

  const yarnPath = which.sync("yarn", { nothrow: true });
  const npmPath = which.sync("npm", { nothrow: true });
  const upgPath = which.sync("upg", { nothrow: true });

  let packageManager: "npm" | "yarn";

  if (!upgPath) {
    throw new Error("upg not found in PATH.");
  }

  if (upgPath.includes("yarn")) {
    packageManager = "yarn";
  } else if (upgPath.includes("npm")) {
    packageManager = "npm";
  } else {
    throw new Error("Could not determine package manager.");
  }

  const shell = createShell();

  switch (packageManager) {
    case "yarn":
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

      break;

    case "npm":
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

      break;
  }

  success("Updated successfully.");
};