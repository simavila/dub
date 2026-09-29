import { isSameDestinationUrl, normalizeDestinationUrl } from "@dub/utils";
import { describe, expect, test } from "vitest";

describe("normalizeDestinationUrl", () => {
  test.each([
    ["https://acme.com/pricing", "acme.com/pricing"],
    ["https://www.acme.com/pricing/", "acme.com/pricing"],
    ["http://ACME.com/pricing", "acme.com/pricing"],
    ["https://acme.com/pricing#faq", "acme.com/pricing"],
    ["https://acme.com/?b=2&a=1", "acme.com?a=1&b=2"],
    ["https://acme.com/?utm_source=x&plan=pro", "acme.com?plan=pro"],
    ["https://acme.com/?gclid=1&fbclid=2", "acme.com"],
    ["acme.com/pricing", "acme.com/pricing"],
  ])("%s -> %s", (input, expected) => {
    expect(normalizeDestinationUrl(input)).toBe(expected);
  });
});

describe("isSameDestinationUrl", () => {
  test("matches tracking / formatting variations", () => {
    expect(
      isSameDestinationUrl(
        "https://acme.com/pricing",
        "https://www.acme.com/pricing/?utm_campaign=launch",
      ),
    ).toBe(true);
  });

  test("does not match different query params", () => {
    expect(
      isSameDestinationUrl(
        "https://acme.com/signup?plan=pro",
        "https://acme.com/signup?plan=business",
      ),
    ).toBe(false);
  });
});
