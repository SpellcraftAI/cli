import { AUTH0_CLIENT } from "../globs/node";
import { DOMAIN_URL } from "../globs/shared";
import { getPackageJsonValue } from "../packageJson";

export const checkSubscription = async () => {
  const version = await getPackageJsonValue("version");
  if (!version) {
    throw new Error("Failed to get version. Please report this: https://twitter.com/gptlabs");
  }

  const searchParams = new URLSearchParams({ version });
  const result =
    await AUTH0_CLIENT
      .fetch(`${DOMAIN_URL}/api/id/subscription?${searchParams}`)
      .then(res => res.json()) as any;

  if (typeof result.subscription !== "boolean") {
    throw new Error(result?.error ?? "Failed to check subscription. Please report this: https://twitter.com/gptlabs");
  }

  return result.subscription;
};