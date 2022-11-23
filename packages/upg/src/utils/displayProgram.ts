/* eslint-disable no-console */
import { style } from "@tsmodule/log";
import { supportsLanguage } from "cli-highlight";
import { highlight } from "../globs/shared";
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
            const plusOrMinus = style(
              part.added
                ? style("  +  ", ["green"])
                : part.removed
                  ? style("  -  ", ["red"])
                  : "     ",
              ["bold", "dim"]
            );

            const withAddedSigns =
              part
                .value
                .split("\n")
                .map(
                  (line) => part.removed
                    ? style(line, ["dim", "bgRed"]) || ""
                    : line
                )
                .map(
                  (line) => `${plusOrMinus}${!part.removed ? highlight(line, target) : line}`
                )
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
        return `${style(lineNumber.toString().padStart(3, " "), ["dim", "grey"])}   ${line}`;
      })
      .join("\n");

  /**
   * You can breathe again.
   */

  console.log();
  console.group();
  if (iteration) {
    console.log();
    console.log(`   ${style("Iteration", ["dim"])} ${iteration}`);
  }

  console.log(diff ? codeText : withLineNumbers);
  console.log();
  console.log();
  console.groupEnd();
};