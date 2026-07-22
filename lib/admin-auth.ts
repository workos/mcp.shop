import { withAuth } from "@workos-inc/authkit-nextjs";
import { User } from "./with-authkit";

const getAdminUserIds = (): string[] =>
  (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

export const isAdmin = (user: Pick<User, "id">): boolean =>
  getAdminUserIds().includes(user.id);

/**
 * Enforces that the caller is a signed-in user on the admin allow-list.
 * Redirects to sign-in when unauthenticated; throws when the authenticated
 * user is not an admin. Use in the admin page and every admin server action.
 */
export const requireAdmin = async (): Promise<User> => {
  const { user } = await withAuth({ ensureSignedIn: true });

  if (!isAdmin(user)) {
    throw new Error("Forbidden: admin access required");
  }

  return user;
};
