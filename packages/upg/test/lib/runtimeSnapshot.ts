import { createShell } from "universal-shell";
import { PLATFORM_EXTENSIONS } from "../../src/actions/run";
import { useTempFile } from "../../src/utils/useTempFile";

export const testSourceCode = async (
  target: string,
  description: string
) => {
  const shell = createShell();

  /**
   * The generated source code for this target and description.
   */
  const { stdout } = await shell.run(
    `./dist/bin.js -n ${JSON.stringify(target)} ${JSON.stringify(description)}`
  );

  return { stdout };
};

export const testRuntime = async (
  target: string,
  stdout: string,
) => {
  /**
   * Write to a tempfile.
   */
  const extension =
   Object.values(PLATFORM_EXTENSIONS).includes(target)
     ? target
     : PLATFORM_EXTENSIONS[target];

  const tempfile = await useTempFile(stdout, extension);

  const shell = createShell();
  return await shell.run(`./dist/bin.js run ${JSON.stringify(tempfile)} -t ${JSON.stringify(target)}`);
};