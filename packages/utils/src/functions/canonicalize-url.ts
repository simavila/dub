import { UTMTags } from "./urls";

// Query params added by ad platforms / email tools that never change the
// destination a URL points to. Stripped before comparing URLs.
export const CLICK_ID_PARAMS = [
  "fbclid",
  "gclid",
  "gbraid",
  "wbraid",
  "dclid",
  "msclkid",
  "ttclid",
  "twclid",
  "li_fat_id",
  "igshid",
  "mc_cid",
  "mc_eid",
  "_hsenc",
  "_hsmi",
] as const;

const DEFAULT_PORTS: Record<string, string> = {
  "http:": "80",
  "https:": "443",
};

export interface CanonicalizeUrlOptions {
  /**
   * Remove UTM params (utm_source, utm_medium, ...) and `ref`.
   * @default true
   */
  stripUtmParams?: boolean;
  /**
   * Remove known ad-platform click IDs (fbclid, gclid, ...).
   * @default true
   */
  stripClickIds?: boolean;
  /**
   * Treat `www.example.com` and `example.com` as the same host.
   * @default true
   */
  ignoreWww?: boolean;
}

/**
 * Returns a canonical representation of a URL that can be used to check
 * whether two URLs point to the same destination.
 *
 * - lowercases the protocol and hostname (path is left untouched since it can be case-sensitive)
 * - removes default ports, the fragment and trailing slashes
 * - optionally removes `www.`, UTM params and ad click IDs
 * - sorts the remaining query params so their order doesn't matter
 *
 * The result is intended for comparisons only – don't store it or redirect to it.
 * Returns `null` if the input can't be parsed as a URL.
 */
export function canonicalizeUrl(
  url: string,
  options: CanonicalizeUrlOptions = {},
): string | null {
  const {
    stripUtmParams = true,
    stripClickIds = true,
    ignoreWww = true,
  } = options;

  let urlObj: URL;
  try {
    urlObj = new URL(url.trim());
  } catch {
    return null;
  }

  const protocol = urlObj.protocol.toLowerCase();
  let hostname = urlObj.hostname.toLowerCase();

  if (ignoreWww && hostname.startsWith("www.")) {
    hostname = hostname.slice(4);
  }

  const port =
    urlObj.port && urlObj.port !== DEFAULT_PORTS[protocol]
      ? `:${urlObj.port}`
      : "";

  const paramsToStrip = new Set<string>([
    ...(stripUtmParams ? UTMTags : []),
    ...(stripClickIds ? CLICK_ID_PARAMS : []),
  ]);

  const params: [string, string][] = [];
  urlObj.searchParams.forEach((value, key) => {
    if (!paramsToStrip.has(key.toLowerCase())) {
      params.push([key, value]);
    }
  });

  params.sort(([keyA, valueA], [keyB, valueB]) =>
    keyA === keyB ? valueA.localeCompare(valueB) : keyA.localeCompare(keyB),
  );

  const search = params.length
    ? `?${new URLSearchParams(params).toString()}`
    : "";

  const pathname = urlObj.pathname.replace(/\/+$/, "");

  return `${protocol}//${hostname}${port}${pathname}${search}`;
}
