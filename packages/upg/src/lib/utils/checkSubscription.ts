import { AUTH0_CLIENT } from "../globs/node";
import { DOMAIN_URL } from "../globs/shared";

export const checkSubscription = async () => {
  const result =
    await AUTH0_CLIENT
      .fetch(`${DOMAIN_URL}/api/id/subscription`)
      .then(res => res.json()) as any;

  if (typeof result.subscription !== "boolean") {
    throw new Error(result.error);
  }

  return result.subscription;
};