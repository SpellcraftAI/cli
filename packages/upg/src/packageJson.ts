import { readFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

export type PackageJson = Record<string, string>;

export const getPackageJson = async (): Promise<PackageJson | null> => {
  const packageJsonPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../package.json"
  );

  try {
    return JSON.parse(await readFile(packageJsonPath, "utf8"));
  } catch (e) {
    return null;
  }
};

export const getPackageJsonValue = async (field: string) => {
  const packageJson = await getPackageJson();
  return packageJson?.[field] ?? null;
};