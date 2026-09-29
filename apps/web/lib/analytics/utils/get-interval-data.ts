import { tz, TZDate } from "@date-fns/tz";
import { DUB_FOUNDING_DATE } from "@dub/utils";
import {
  endOfQuarter,
  endOfToday,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
  subHours,
  subMonths,
  subQuarters,
} from "date-fns";

const INTERVAL_DATA: Record<
  string,
  ({ timezone }: { timezone?: string }) => {
    startDate: TZDate;
    endDate: TZDate;
    granularity: "hour" | "day" | "month";
  }
> = {
  "24h": ({ timezone }) => ({
    startDate: subHours(new TZDate(Date.now(), timezone), 24),
    endDate: new TZDate(Date.now(), timezone),
    granularity: "hour",
  }),
  "7d": ({ timezone }) => ({
    startDate: subDays(new TZDate(Date.now(), timezone), 7),
    endDate: endOfToday({ in: timezone ? tz(timezone) : undefined }),
    granularity: "day",
  }),
  "30d": ({ timezone }) => ({
    startDate: subDays(new TZDate(Date.now(), timezone), 30),
    endDate: endOfToday({ in: timezone ? tz(timezone) : undefined }),
    granularity: "day",
  }),
  "90d": ({ timezone }) => ({
    startDate: subDays(new TZDate(Date.now(), timezone), 90),
    endDate: endOfToday({ in: timezone ? tz(timezone) : undefined }),
    granularity: "day",
  }),
  "1y": ({ timezone }) => ({
    startDate: subMonths(new TZDate(Date.now(), timezone), 12),
    endDate: endOfToday({ in: timezone ? tz(timezone) : undefined }),
    granularity: "month",
  }),
  mtd: ({ timezone }) => {
    return {
      startDate: startOfMonth(new TZDate(Date.now(), timezone)),
      endDate: endOfToday({ in: timezone ? tz(timezone) : undefined }),
      granularity: "day",
    };
  },
  qtd: ({ timezone }) => ({
    startDate: startOfQuarter(new TZDate(Date.now(), timezone)),
    endDate: endOfToday({ in: timezone ? tz(timezone) : undefined }),
    granularity: "day",
  }),
  ytd: ({ timezone }) => ({
    startDate: startOfYear(new TZDate(Date.now(), timezone)),
    endDate: endOfToday({ in: timezone ? tz(timezone) : undefined }),
    granularity: "month",
  }),
  last_month: ({ timezone }) => {
    const now = new TZDate(Date.now(), timezone);
    return {
      startDate: startOfMonth(subMonths(now, 1)),
      endDate: subDays(startOfMonth(now), 1),
      granularity: "day",
    };
  },
  last_quarter: ({ timezone }) => {
    const lastQuarter = subQuarters(new TZDate(Date.now(), timezone), 1);
    return {
      startDate: startOfQuarter(lastQuarter),
      endDate: endOfQuarter(lastQuarter),
      granularity: "day",
    };
  },
  all: ({ timezone }) => ({
    startDate: new TZDate(DUB_FOUNDING_DATE, timezone),
    endDate: endOfToday({ in: timezone ? tz(timezone) : undefined }),
    granularity: "month",
  }),
};

export const getIntervalData = (
  interval: string,
  { timezone }: { timezone?: string } = {},
) => INTERVAL_DATA[interval]({ timezone });
