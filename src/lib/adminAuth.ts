import type { User } from "firebase/auth";

export const ADMIN_EMAIL = "ratnasekharlatike@gmail.com";

type AdminIdentity = Pick<User, "email" | "emailVerified">;

export const isAuthorizedAdmin = (user: AdminIdentity | null) =>
  Boolean(user?.emailVerified && user.email?.toLowerCase() === ADMIN_EMAIL);
