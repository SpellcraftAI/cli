#!/usr/bin/env node
/* eslint-disable no-console */
import { Command, program } from "commander";
import { readFile } from "fs/promises";
import { env } from "process";

import { editCommand } from "./commands/edit";
import { newCommand } from "./commands/new";
import { chalk } from "./lib/globs/shared";
import { withFormatting } from "./lib/utils/formatting";
import { error, success } from "./lib/utils/log";
import { AUTH0_CLIENT } from "./lib/globs/node";
import { loginCommand } from "./commands/login";
import { logoutCommand } from "./commands/logout";
import { explainCommand } from "./commands/explain";
import { updateCommand } from "./commands/update";

program
  .name("upg")
  .description("Generate programs for any language or platform.");

program
  .command("new", { isDefault: true })
  .description("Create a new program.")
  .argument("[description]", "A description of the command to generate.")
  .option("-t, --target [target]", "The target to generate the script for.\nDefaults to Bash for Linux, ZSH for Mac, and Windows Shell for Windows.")
  .option("-n, --non-interactive", "Run without interactivity.")
  .action(withFormatting(newCommand));

program
  .command("edit")
  .description("Edit a program from a file.")
  .argument("<file>", "The program to edit.")
  .action(withFormatting(editCommand));

program
  .command("explain")
  .description("Explain a program by pasting it or loading from file.")
  // .option("-f, --file [file]", "The file to explain.")
  .action(withFormatting(explainCommand));


program
  .command("login")
  .description("Log in to your account.")
  .action(withFormatting(loginCommand));

program
  .command("logout")
  .description("Log out of your account.\n\n")
  .action(withFormatting(logoutCommand));

program
  .command("update")
  .description("Update the CLI to the latest version.")
  .action(withFormatting(updateCommand));

/**
 * Display logo.
 */
const logoFile = new URL("./header.txt", import.meta.url);
const taglinesFile = new URL("./taglines.txt", import.meta.url);

const logo = await readFile(logoFile, "utf8");
const taglines = await readFile(taglinesFile, "utf8").then((data) => data.split("\n"));

console.group();

if (env.NODE_ENV !== "test") {
  console.log(chalk.dim(logo.replace(
    "Not competent enough to render a tagline!",
    taglines[Math.floor(Math.random() * taglines.length)]
  )));
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
const whitelist = ["help", "--help", "login", "logout"];
if (
  env.NODE_ENV !== "test" &&
  !whitelist.includes(process.argv.slice(2)[0])
) {
  const user = await AUTH0_CLIENT.getUser();
  if (!user) {
    error(
      chalk.dim("You are logged out."),
      "Run \"upg login\" to log in."
    );

    process.exit(1);
  }

  // console.log(user);
  success(`Logged in as ${chalk.underline(user.email)}.`);
}

program.parse(process.argv);
console.groupEnd();