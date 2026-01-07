import { handleAuth, getSignInUrl } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";
import { getPostHogClient } from "@/lib/posthog-server";

export const GET = handleAuth({
  onError: async (error) => {
    console.error("Error authenticating", error);

    // PostHog: Track authentication errors
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: "anonymous",
      event: "auth_error",
      properties: {
        error_message: error instanceof Error ? error.message : "Unknown error",
        error_name: error instanceof Error ? error.name : "UnknownError",
      },
    });
    await posthog.shutdown();

    // TODO: Should probably do something more than just redirect back to the
    // sign-in page (without even an error message!)
    redirect(await getSignInUrl());
  },
});
