#!/usr/bin/env node
/* eslint-disable no-console */
import { Command, program } from "commander";
import { readFile } from "fs/promises";
import { env } from "process";
import { oraPromise } from "ora";
// import { spinners } from "@tsmodule/spinners";

import { SUBSCRIPTION_LOCK, VERSION } from "./globs/shared";
import { AUTH0_CLIENT } from "./globs/node";

import { withErrorFormatting } from "./utils/errorFormatting";
import { error, log, style, warn } from "@tsmodule/log";
import { checkSubscription } from "./utils/checkSubscription";

import { loadCommand } from "./commands/load";
import { newCommand } from "./commands/new";
import { loginCommand } from "./commands/login";
import { logoutCommand } from "./commands/logout";
import { explainCommand } from "./commands/explain";
import { updateCommand } from "./commands/update";
import { authorizeCommand } from "./commands/authorize";
import { runCommand } from "./commands/run";

/**
 * Stdin content piped into a command.
 */
export let PROCESS_PIPED_STDIN = "";

program
  .name("upg")
  .description("Generate programs for any language or platform.");

program
  .command("new", { isDefault: true })
  .description("Create a new program.")
  .argument("[target]", "The target to generate the script for.\nDefaults to Bash for Linux, ZSH for Mac, and Windows Shell for Windows.")
  .argument("[description]", "A description of the command to generate.")
  .option("-n, --non-interactive", "Run without interactivity.")
  .action(withErrorFormatting(newCommand));

program
  .command("load")
  .description("Load a program from a file.")
  .argument("<file>", "The file to load.")
  .action(withErrorFormatting(loadCommand));

program
  .command("run")
  .description("Run a program and start editing.")
  .argument("[file]", "The file to run.")
  .option("-t, --target <target>", "The target to run the script for (e.g. \"python\").")
  .option("-n, --non-interactive", "Print output and exit without looping.")
  .action(withErrorFormatting(runCommand));

program
  .command("explain")
  .description("Explain a program by pasting it or loading from file.\n\n")
  .option("-n, --non-interactive", "Run without interactivity.")
  .argument("[file]", "The file to explain.")
  .action(withErrorFormatting(explainCommand));


program
  .command("login")
  .description("Log in to your account.")
  .action(withErrorFormatting(loginCommand));

program
  .command("logout")
  .description("Log out of your account.")
  .action(withErrorFormatting(logoutCommand));

program
  .command("authorize")
  .description("Create a new authorization code to log in via SSH.\n\n")
  .action(withErrorFormatting(authorizeCommand));

program
  .command("update")
  .description("Update the CLI to the latest version.")
  .action(withErrorFormatting(updateCommand));

program
  .command("version")
  .description("Check the current version of UPG.")
  .action(() => {
    log(`UPG version: ${style(VERSION, ["underline"])}.`);
  });

/**
 * Display logo.
 */
const logoFile = new URL("./header.txt", import.meta.url);
const taglinesFile = new URL("./taglines.txt", import.meta.url);

const logo = await readFile(logoFile, "utf8");
const taglines = await readFile(taglinesFile, "utf8").then((data) => data.split("\n"));

if (env.NODE_ENV !== "test") {
  console.warn(
    style(
      logo
        .replace(
          "Not competent enough to render a tagline!",
          taglines[Math.floor(Math.random() * taglines.length)]
        )
        .replace(
          "(A version number goes here)",
          VERSION
        ),
      ["dim"]
    ),
  );
  console.warn();
}

/**
 * Add padding to the help text.
 */
const helpInformation = Command.prototype.helpInformation;
Command.prototype.helpInformation = function () {
  return helpInformation.call(this).replace(/^/gm, "   ") + "\n\n";
};

/**
 * Warn if a user is trying to access non-auth commands without being logged in.
 */
const whitelist = ["help", "--help", "login", "logout", "authorize", "version", "update"];
if (
  env.NODE_ENV !== "test" &&
  !whitelist.includes(process.argv.slice(2)[0])
) {
  const user = await AUTH0_CLIENT.getUser();
  if (!user) {
    error(
      "You are logged out.",
      ["dim", "redBright"],
      { postLines: 0 }
    );

    error("Run \"upg login\" to log in.");
    process.exit(1);
  }

  // console.log(user);
  warn("Logged in.", ["bold", "green"]);

  if (SUBSCRIPTION_LOCK) {
    warn();
    await oraPromise(checkSubscription, {
      text: "Checking subscription...",
      indent: 2,
    });
    warn();
    // log();
    // await spinners({
    //   "Checking subscription...": async () => {
    //     await withErrorFormatting(checkSubscription)();
    //   }
    // });
  }
}

/**
 * Will read piped input and pass it to the command if exists, otherwise will
 * treat as TTY and enter regular interactive flow.
 */
if(process.stdin.isTTY || env.NODE_ENV === "test") {
  program.parse(process.argv);
} else {
  process.stdin.on("readable", function() {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      PROCESS_PIPED_STDIN += chunk;
    }
  });

  process.stdin.on("end", function() {
    program.parse(process.argv);
  });
}