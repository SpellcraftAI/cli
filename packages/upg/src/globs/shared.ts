import { platform } from "os";
import { env } from "process";
import { highlight as highlightRaw } from "cli-highlight";
import { getPackageJson } from "../packageJson";

export const SUBSCRIPTION_LOCK = true;

export const PACKAGE_JSON = await getPackageJson();
if (!PACKAGE_JSON) {
  throw new Error("Failed to get package.json. Please report this: https://twitter.com/gptlabs");
}

export const { version: VERSION } = PACKAGE_JSON;

export const DEVELOPMENT = (
  /** Inlined by compiler. */
  process.env.NODE_ENV === "development" ||
  /** Checked at runtime. */
  env.NODE_ENV === "test"
);

export const TESTING = env.NODE_ENV === "test";
export const PRODUCTION = !DEVELOPMENT;

export const highlight = (code: string, language: string) => {
  if (TESTING) {
    return code;
  }

  return highlightRaw(code, {
    language,
  });
};

/**
 * The URL this site is running on.
 */
export const DOMAIN =
  PRODUCTION
    ? "upg.ai"
    : "localhost:3000";

export const DOMAIN_URL =
  DOMAIN === "localhost:3000"
    ? `http://${DOMAIN}`
    : `https://${DOMAIN}`;

export let DEFAULT_SHELL = "bash";

switch (platform()) {
  case "darwin":
    DEFAULT_SHELL = "zsh";
    break;
  case "win32":
    DEFAULT_SHELL = "cmd";
    break;
}