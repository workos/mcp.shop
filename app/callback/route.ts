import { handleAuth, getSignInUrl } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export const GET = handleAuth({
  onError: async (error) => {
    console.error("Error authenticating", error);

    // TODO: Should probably do something more than just redirect back to the
    // sign-in page (without even an error message!)
    redirect(await getSignInUrl());
  },
});
