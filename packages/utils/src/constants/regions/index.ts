import { AFRICA_REGIONS } from "./africa";
import { ASIA_REGIONS } from "./asia";
import { EUROPE_REGIONS } from "./europe";
import { NORTH_AMERICA_REGIONS } from "./north-america";
import { OCEANIA_REGIONS } from "./oceania";
import { SOUTH_AMERICA_REGIONS } from "./south-america";

// Regions (ISO 3166-2 subdivisions) grouped by continent code.
// Continent codes match `CONTINENTS` / `COUNTRIES_TO_CONTINENTS`.
export const REGIONS_BY_CONTINENT: Record<string, Record<string, string>> = {
  AF: AFRICA_REGIONS,
  AS: ASIA_REGIONS,
  EU: EUROPE_REGIONS,
  NA: NORTH_AMERICA_REGIONS,
  OC: OCEANIA_REGIONS,
  SA: SOUTH_AMERICA_REGIONS,
};

export const REGIONS: { [key: string]: string } = {
  ...AFRICA_REGIONS,
  ...ASIA_REGIONS,
  ...EUROPE_REGIONS,
  ...NORTH_AMERICA_REGIONS,
  ...OCEANIA_REGIONS,
  ...SOUTH_AMERICA_REGIONS,
};

export const REGION_CODES = Object.keys(REGIONS) as [string, ...string[]];

export const getRegionsForCountry = (countryCode: string) => {
  const prefix = `${countryCode.toUpperCase()}-`;
  return Object.keys(REGIONS)
    .filter((code) => code.startsWith(prefix))
    .reduce<Record<string, string>>((acc, code) => {
      acc[code] = REGIONS[code];
      return acc;
    }, {});
};
