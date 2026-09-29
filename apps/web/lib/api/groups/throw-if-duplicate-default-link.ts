import { DubApiError } from "@/lib/api/errors";
import { areUrlsEquivalent } from "@dub/utils";
import { Prisma } from "@prisma/client";

/**
 * Throws a `conflict` error if the group already has a default link that
 * points to the same destination as `url` (see `canonicalizeUrl`).
 *
 * The unique index on (groupId, url) only catches exact string matches, so
 * variations like `www.`, trailing slashes or tracking params would otherwise
 * create a second default link for the same destination.
 */
export async function throwIfDuplicateDefaultLink({
  tx,
  groupId,
  url,
  excludeDefaultLinkId,
}: {
  tx: Prisma.TransactionClient;
  groupId: string;
  url: string;
  excludeDefaultLinkId?: string;
}) {
  const defaultLinks = await tx.partnerGroupDefaultLink.findMany({
    where: {
      groupId,
      ...(excludeDefaultLinkId && {
        id: {
          not: excludeDefaultLinkId,
        },
      }),
    },
    select: {
      id: true,
      url: true,
    },
  });

  const duplicate = defaultLinks.find((link) =>
    areUrlsEquivalent(link.url, url),
  );

  if (duplicate) {
    throw new DubApiError({
      code: "conflict",
      message: `A default link with this URL already exists (${duplicate.id}).`,
    });
  }
}
