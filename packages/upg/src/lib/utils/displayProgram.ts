/* eslint-disable no-console */
import { supportsLanguage } from "cli-highlight";
import { chalk, highlight } from "../globs/shared";
import { State } from "../state";

export const displayProgram = (
  { code, target, diff }: State,
  iteration?: number
) => {
  if (!code || !target) {
    return;
  }

  /**
   * Buckle up, it's about to get real.
   */

  let codeText = code;
  if (supportsLanguage(target)) {
    if (!diff) {
      codeText = highlight(code, target);
    } else {
      codeText =
        diff
          .map((part, i) => {
            const plusOrMinus = chalk.bold(
              part.added ? chalk.green("  +  ") : part.removed ? chalk.red("  -  ") : "     "
            );

            const withAddedSigns =
              part
                .value
                .split("\n")
                .map((line) => `${plusOrMinus}${!part.removed ? highlight(line, target) : line}`)
                .map((line) => part.removed ? chalk.dim(chalk.red(line)) : line)
                // .map((line) => part.removed ? chalk.bgAnsi256(225)(line) : part.added ? chalk.bgAnsi256(158)(line) : line)
                .join("\n");

            const withEndingNewline =
              i > 0 && !part.value.startsWith("\n")
                ? `\n${withAddedSigns}`
                : withAddedSigns;

            return withEndingNewline;
          })
          .join("");
    }
  }

  const lines = codeText.split("\n");
  const withLineNumbers =
    lines
      .map((line, index) => {
        const lineNumber = index + 1;
        return `${chalk.dim(chalk.gray(lineNumber.toString().padStart(3, " ")))}   ${line}`;
      })
      .join("\n");

  /**
   * You can breathe again.
   */

  console.group();
  if (iteration) {
    console.log();
    console.log(`   ${chalk.dim("Iteration")} ${iteration}`);
  }

  console.log();
  console.log(diff ? codeText : withLineNumbers);
  console.log();
  console.log();
  console.groupEnd();
};