import { areUrlsEquivalent, canonicalizeUrl } from "@dub/utils";
import { describe, expect, it } from "vitest";

describe("canonicalizeUrl", () => {
  it("returns null for invalid URLs", () => {
    expect(canonicalizeUrl("not a url")).toBeNull();
    expect(canonicalizeUrl("")).toBeNull();
  });

  it("lowercases the protocol and hostname but not the path", () => {
    expect(canonicalizeUrl("HTTPS://Acme.COM/Pricing")).toBe(
      "https://acme.com/Pricing",
    );
  });

  it("removes trailing slashes, fragments and default ports", () => {
    expect(canonicalizeUrl("https://acme.com/")).toBe("https://acme.com");
    expect(canonicalizeUrl("https://acme.com/pricing/#plans")).toBe(
      "https://acme.com/pricing",
    );
    expect(canonicalizeUrl("https://acme.com:443/pricing")).toBe(
      "https://acme.com/pricing",
    );
    expect(canonicalizeUrl("http://acme.com:80/pricing")).toBe(
      "http://acme.com/pricing",
    );
  });

  it("keeps non-default ports", () => {
    expect(canonicalizeUrl("https://acme.com:8443/pricing")).toBe(
      "https://acme.com:8443/pricing",
    );
  });

  it("does not treat http and https as the same URL", () => {
    expect(canonicalizeUrl("http://acme.com")).not.toBe(
      canonicalizeUrl("https://acme.com"),
    );
  });

  describe("www handling", () => {
    it("strips www. by default", () => {
      expect(canonicalizeUrl("https://www.acme.com/pricing")).toBe(
        "https://acme.com/pricing",
      );
    });

    it("keeps www. when ignoreWww is false", () => {
      expect(
        canonicalizeUrl("https://www.acme.com/pricing", { ignoreWww: false }),
      ).toBe("https://www.acme.com/pricing");
    });
  });

  describe("query params", () => {
    it("sorts query params so order doesn't matter", () => {
      expect(canonicalizeUrl("https://acme.com/?b=2&a=1")).toBe(
        canonicalizeUrl("https://acme.com/?a=1&b=2"),
      );
    });

    it("strips UTM params and ref by default", () => {
      expect(
        canonicalizeUrl(
          "https://acme.com/pricing?utm_source=twitter&utm_medium=social&ref=partner&plan=pro",
        ),
      ).toBe("https://acme.com/pricing?plan=pro");
    });

    it("keeps UTM params when stripUtmParams is false", () => {
      expect(
        canonicalizeUrl("https://acme.com/?utm_source=twitter", {
          stripUtmParams: false,
        }),
      ).toBe("https://acme.com?utm_source=twitter");
    });

    it("strips ad click IDs by default", () => {
      expect(
        canonicalizeUrl("https://acme.com/?gclid=abc&fbclid=def&msclkid=ghi"),
      ).toBe("https://acme.com");
    });

    it("keeps click IDs when stripClickIds is false", () => {
      expect(
        canonicalizeUrl("https://acme.com/?gclid=abc", {
          stripClickIds: false,
        }),
      ).toBe("https://acme.com?gclid=abc");
    });

    it("preserves repeated params", () => {
      expect(canonicalizeUrl("https://acme.com/?tag=b&tag=a")).toBe(
        "https://acme.com?tag=a&tag=b",
      );
    });
  });

  it("treats common variations of the same destination as equal", () => {
    const variations = [
      "https://acme.com/pricing",
      "https://www.acme.com/pricing/",
      "https://ACME.com/pricing?utm_source=newsletter",
      "https://acme.com:443/pricing#faq",
      "https://acme.com/pricing?fbclid=IwAR123",
    ];

    const canonical = variations.map((url) => canonicalizeUrl(url));
    expect(new Set(canonical).size).toBe(1);
  });
});

describe("areUrlsEquivalent", () => {
  it("returns true for URLs with the same canonical form", () => {
    expect(
      areUrlsEquivalent(
        "https://acme.com/pricing",
        "https://www.acme.com/pricing/?utm_source=partner",
      ),
    ).toBe(true);
  });

  it("returns false for URLs with different meaningful params", () => {
    expect(
      areUrlsEquivalent(
        "https://acme.com/signup?plan=pro",
        "https://acme.com/signup?plan=business",
      ),
    ).toBe(false);
  });

  it("respects options", () => {
    expect(
      areUrlsEquivalent("https://acme.com", "https://www.acme.com", {
        ignoreWww: false,
      }),
    ).toBe(false);
  });

  it("never treats unparseable URLs as equivalent", () => {
    expect(areUrlsEquivalent("not a url", "not a url")).toBe(false);
  });
});
