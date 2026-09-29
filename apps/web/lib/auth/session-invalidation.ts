import { JWT } from "next-auth/jwt";

/**
 * Returns true if the given JWT was issued before `changedAt`.
 *
 * Used to invalidate sessions after a password reset / change: any token
 * minted before `User.passwordChangedAt` should no longer be accepted.
 *
 * Note: `iat` is in seconds, `changedAt` is a Date (milliseconds).
 */
export function isTokenIssuedBefore(
  token: JWT,
  changedAt: Date | null | undefined,
) {
  if (!changedAt || typeof token.iat !== "number") {
    return false;
  }

  return token.iat * 1000 < changedAt.getTime();
}
