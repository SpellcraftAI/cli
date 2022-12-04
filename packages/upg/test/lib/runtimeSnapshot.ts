import { ExecutionContext } from "ava";
import { createShell } from "universal-shell";
import { PLATFORM_EXTENSIONS } from "../../src/actions/run";
import { useTempFile } from "../../src/utils/useTempFile";

export const testSourceCode = async (
  t: ExecutionContext,
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

  t.snapshot(stdout.trim(), "Generated source code");
  return stdout;
};

export const testRuntime = async (
  t: ExecutionContext,
  target: string,
  stdout: string,
) => {
  if (process.env.CI) return t.pass();

  /**
   * Write to a tempfile.
   */
  const extension =
   Object.values(PLATFORM_EXTENSIONS).includes(target)
     ? target
     : PLATFORM_EXTENSIONS[target];

  const tempfile = await useTempFile(stdout, extension);

  const shell = createShell();
  const output = await shell.run(`./dist/bin.js run -n ${JSON.stringify(tempfile)} -t ${JSON.stringify(target)}`);

  t.snapshot(
    {
      stdout: output.stdout.trim(),
      code: output.code,
    },
    "Runtime output"
  );

  return output;
};

export const programSnapshot = async (
  t: ExecutionContext,
  target: string,
  description: string
) => {
  const stdout = await testSourceCode(t, target, description);
  return await testRuntime(t, target, stdout);
};