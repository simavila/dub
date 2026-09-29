type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

export interface PluralizeOptions {
  /**
   * Custom plural form. Used for every non-singular category unless
   * `forms` provides a more specific one.
   */
  plural?: string;
  /**
   * BCP 47 locale used to pick the plural category (e.g. "en-US", "pl", "ar").
   * @default "en-US"
   */
  locale?: string;
  /**
   * Explicit forms per CLDR plural category, for locales with more than two
   * plural forms, e.g. `{ one: "plik", few: "pliki", many: "plików" }`.
   */
  forms?: Partial<Record<PluralCategory, string>>;
}

const pluralRulesCache = new Map<string, Intl.PluralRules>();

const getPluralRules = (locale: string) => {
  let rules = pluralRulesCache.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(locale);
    pluralRulesCache.set(locale, rules);
  }
  return rules;
};

export const pluralize = (
  word: string,
  count: number,
  options: PluralizeOptions = {},
): string => {
  const { plural, locale = "en-US", forms } = options;

  const category: PluralCategory = getPluralRules(locale).select(count);

  if (forms?.[category]) {
    return forms[category];
  }

  if (category === "one") {
    return word;
  }

  // Use custom plural form if provided, otherwise add 's'
  return plural || `${word}s`;
};
