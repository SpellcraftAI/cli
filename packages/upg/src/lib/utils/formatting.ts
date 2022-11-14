/* eslint-disable @typescript-eslint/no-explicit-any */
import { chalk } from "../globs/shared";
import { log } from "./log";

/* eslint-disable no-console */
export const withFormatting = (fn: (...args: any[]) => any) => {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : JSON.stringify(error);

      log(`${chalk.red("ERROR:")} ${errorMessage}`);

      process.exit(1);
    }
  };
};