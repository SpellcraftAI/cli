/* eslint-disable @typescript-eslint/no-explicit-any */
import { chalk } from "../globs/shared";
import { error, errorLog } from "./log";

/* eslint-disable no-console */
export const withErrorFormatting = (fn: (...args: any[]) => any) => {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (e) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : JSON.stringify(e);

      if (errorMessage === "Request failed with status code 503") {
        error("Issue with OpenAI API. Please see the status page at:", "https://status.openai.com/");
      }

      errorLog(`${chalk.red("ERROR:")} ${errorMessage}`);
      process.exit(1);
    }
  };
};