/* eslint-disable no-console */
import { chalk } from "../globs/shared";

export const log = (...messages: string[]) => {
  console.group();
  console.group();
  console.log();
  console.log(messages.join("\n"));
  console.log();
  console.groupEnd();
  console.groupEnd();
};

export const logDim = (...messages: string[]) => {
  log(chalk.dim(messages.join("\n")));
};

export const logBold = (...messages: string[]) => {
  log(chalk.bold(messages.join("\n")));
};

export const success = (...messages: string[]) => {
  logBold(chalk.green(messages.join("\n")));
};

export const error = (...messages: string[]) => {
  logBold(chalk.red(messages.join("\n")));
};