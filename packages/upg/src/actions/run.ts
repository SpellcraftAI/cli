import prompts from "prompts";

import { performance } from "perf_hooks";

import { createShell } from "await-shell";
import { rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { resolve } from "path";

import { chalk } from "../globs/shared";
import { error, log, success } from "../utils/log";
import { Action } from "./types";

export const EXECUTION_COMMANDS = {
  bash: "bash",
  zsh: "zsh",
  python: "python3",
  javascript: "node",
  typescript: "tsmodule",
  // typescript: `ts-node -O ${JSON.stringify({ lib: ["dom", "esnext"] })}`,
};

export const PLATFORM_EXTENSIONS = {
  bash: "sh",
  zsh: "zsh",
  python: "py",
  javascript: "js",
  typescript: "ts",
};

export const PLATFORMS = Object.keys(EXECUTION_COMMANDS);
export const EXTENSIONS = Object.values(PLATFORM_EXTENSIONS);

export const run: Action = async (state) => {
  if (!state || !state.code) {
    throw new Error("Nothing to run.");
  }

  const { code } = state;
  let { target } = state;

  const shell = createShell({
    stdio: ["inherit", "pipe", "pipe"],
    log: true,
  });

  let fileExtension: string;
  if (target && EXTENSIONS.includes(target)) {
    fileExtension = target;
  } else if (target && PLATFORMS.includes(target)) {
    const targetPlatform = target as keyof typeof PLATFORM_EXTENSIONS;
    fileExtension = PLATFORM_EXTENSIONS[targetPlatform];
  } else {
    const { extension } = await prompts({
      type: "text",
      name: "extension",
      message: "What file extension should be used?",
    });
    fileExtension = extension;
  }

  /**
   * Ensure file extensions don't start with a dot.
   */
  if (fileExtension.startsWith(".")) {
    fileExtension = fileExtension.replace(/^\.+/, "");
  }

  /**
   * Ensure the target matches the inferred platform.
   */
  for (const [platform, extension] of Object.entries(PLATFORM_EXTENSIONS)) {
    if (fileExtension === extension) {
      target = platform;
    }
  }

  /**
   * Random 16-character string filename.
   */
  const tempname = Math.random().toString(36).substring(0, 15);
  const tempfile = resolve(tmpdir(), `${tempname}.${fileExtension}`);

  /**
   * Write the tempfile.
   */
  await writeFile(tempfile, code);

  let command: string;
  if (target && PLATFORMS.includes(target)) {
    command = EXECUTION_COMMANDS[target as keyof typeof EXECUTION_COMMANDS];
  } else {
    const { command: promptCommand } = await prompts({
      type: "text",
      name: "command",
      message: "What command should be called to execute this program as a file? (e.g. 'node', 'python3', 'bash')",
    });

    command = promptCommand;
  }

  if (!command) {
    throw new Error("No execution command provided.");
  }

  log(
    chalk.dim("-".repeat(30)),
    chalk.dim(chalk.bold("Output")),
    chalk.dim("-".repeat(30)),
  );

  const startTime = performance.now();
  const { code: exitCode, stdout, stderr } = await shell.run(`${command} ${tempfile}`);
  const endTime = performance.now();
  const duration = endTime - startTime;

  log(chalk.dim("-".repeat(30)));

  const logCommand = exitCode === 0 ? success : error;
  logCommand(
    chalk.dim(`${command} exited with code ${exitCode}.`),
    `Execution time: ${duration.toFixed(2)}ms`
  );

  /**
   * Remove the tempfile.
   */
  await rm(tempfile);

  const lastRun = {
    exitCode,
    stderr,
    stdout,
  };

  return {
    ...state,
    lastRun,
  };
};