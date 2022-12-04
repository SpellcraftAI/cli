import { tmpdir } from "os";
import { resolve } from "path";
import { writeFile } from "fs/promises";

/**
 * Create a tempfile for the given file contents.
 *
 * @param contents The contents of the file.
 * @param extension The file extension to use.
 * @returns The path to the tempfile.
 */
export const useTempFile = async (
  contents: string,
  extension: string
) => {
  /**
   * Random 16-character string filename.
   */
  const tempname = Math.random().toString(36).substring(0, 15);
  const tempfile = resolve(tmpdir(), `${tempname}.${extension}`);

  /**
    * Write the tempfile.
    */
  await writeFile(tempfile, contents);
  return tempfile;
};