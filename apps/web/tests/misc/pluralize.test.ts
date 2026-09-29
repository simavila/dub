import { pluralize } from "@dub/utils";
import { describe, expect, it } from "vitest";

describe("pluralize", () => {
  it("returns the singular form for a count of 1", () => {
    expect(pluralize("link", 1)).toBe("link");
  });

  it("adds an 's' for other counts by default", () => {
    expect(pluralize("link", 0)).toBe("links");
    expect(pluralize("link", 2)).toBe("links");
  });

  it("uses the custom plural form when provided", () => {
    expect(pluralize("has", 3, { plural: "have" })).toBe("have");
  });

  it("picks the right form for locales with multiple plural categories", () => {
    const forms = { one: "plik", few: "pliki", many: "plików" };

    expect(pluralize("plik", 1, { locale: "pl", forms })).toBe("plik");
    expect(pluralize("plik", 3, { locale: "pl", forms })).toBe("pliki");
    expect(pluralize("plik", 5, { locale: "pl", forms })).toBe("plików");
  });
});
