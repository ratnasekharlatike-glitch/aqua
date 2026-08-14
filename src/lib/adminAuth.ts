import type { User } from "firebase/auth";

export const ADMIN_EMAIL = "ratnasekharlatike@gmail.com";

export const isAuthorizedAdmin = (user: User | null) =>
  user?.email?.toLowerCase() === ADMIN_EMAIL;
