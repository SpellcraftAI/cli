import { platform } from "os";
import { env } from "process";
import { highlight as highlightRaw } from "cli-highlight";
import { getPackageJson } from "../packageJson";

/**
 * Whether or not users must have a valid subscription to access the API.
 */
export const SUBSCRIPTION_LOCK = true;

/**
 * The contents of the package.json file at runtime.
 */
export const PACKAGE_JSON = await getPackageJson();
if (!PACKAGE_JSON) {
  throw new Error("Failed to get package.json. Please report this: https://twitter.com/gptlabs");
}

/**
 * The version of this package at runtime.
 */
export const { version: VERSION } = PACKAGE_JSON;

/**
 * Whether this is the canary build.
 */
export const CANARY = VERSION.includes("canary");

/**
 * Whether this process is running in development mode.
 */
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
    ? (
      CANARY
        ? "canary.upg.ai"
        : "upg.ai"
    )
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