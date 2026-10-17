import type {
  Metric,
  Plan,
  Range,
  Subscription,
  SubscriptionStatus,
  TrendPoint,
} from "./types";

/**
 * Deterministic mock dataset for the Meridian revenue dashboard.
 * Everything is generated from a seeded PRNG and cached per process, so the
 * demo looks identical on every reload and every deployment.
 */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20261017);

const round10 = (n: number) => Math.round(n / 10) * 10;

function lastNMonths(n: number): { label: string }[] {
  const out: { label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      label: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return out;
}

function generateMonthly(): TrendPoint[] {
  const months = lastNMonths(12);
  let total = 36400;
  return months.map((m, i) => {
    const ramp = 1 + (i / 11) * 0.35;
    const newMrr = round10(9200 * ramp + rng() * 1800 - 900);
    const expansionMrr = round10(4100 * (1 + i / 22) + rng() * 900 - 450);
    const churnedMrr = -round10(2350 * (1 + i / 30) + rng() * 700 - 350);
    total += newMrr + expansionMrr + churnedMrr;
    return {
      period: m.label,
      newMrr,
      expansionMrr,
      churnedMrr,
      totalMrr: round10(total),
    };
  });
}

function generateDaily(days: number): TrendPoint[] {
  const monthly = getMonthly();
  const prev = monthly[monthly.length - 2];
  const last = monthly[monthly.length - 1];
  const now = new Date();
  const points: TrendPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const t = (days - 1 - i) / (days - 1);
    const lerp = (a: number, b: number) => a + (b - a) * t;
    const noise = () => (rng() - 0.5) * 0.16;
    points.push({
      period: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      newMrr: round10((lerp(prev.newMrr, last.newMrr) / 30) * (1 + noise())),
      expansionMrr: round10(
        (lerp(prev.expansionMrr, last.expansionMrr) / 30) * (1 + noise()),
      ),
      churnedMrr: -round10(
        (lerp(prev.churnedMrr, last.churnedMrr) / 30) * (1 + noise()),
      ),
      totalMrr: round10(lerp(prev.totalMrr, last.totalMrr)),
    });
  }
  return points;
}

let monthlyCache: TrendPoint[] | null = null;
const dailyCache = new Map<number, TrendPoint[]>();

function getMonthly(): TrendPoint[] {
  if (!monthlyCache) monthlyCache = generateMonthly();
  return monthlyCache;
}

function getDaily(days: number): TrendPoint[] {
  let cached = dailyCache.get(days);
  if (!cached) {
    cached = generateDaily(days);
    dailyCache.set(days, cached);
  }
  return cached;
}

export function getTrendSeries(range: Range): TrendPoint[] {
  if (range === "12m") return getMonthly();
  return getDaily(range === "7d" ? 7 : 30);
}

/* ------------------------------ subscriptions ------------------------------ */

const PREFIXES = [
  "Northwind", "Vertex", "Lumen", "Aperture", "Basalt", "Cobalt", "Datum",
  "Ember", "Fathom", "Granite", "Harbor", "Indigo", "Juniper", "Kelvin",
  "Lattice", "Meridian", "Nimbus", "Onyx", "Pinnacle", "Quanta", "Radian",
  "Summit", "Tessera", "Umbra", "Vantage", "Waypoint", "Xenon", "Yarrow",
  "Zephyr", "Beacon", "Crestline", "Driftwood", "Everest", "Fairwind",
  "Goldcrest", "Highline", "Ironwood", "Jetstream", "Kestrel", "Larkspur",
  "Mistral", "Nightfall", "Orchard", "Peregrine", "Quarry", "Redwood",
  "Silverline", "Timberline", "Uplift", "Verdant", "Westbrook", "Aurora",
  "Bluepoint", "Clearwater", "Dawnstar", "Eastgate", "Falconridge", "Greylock",
  "Hillcrest", "Inlet", "Junction", "Kingsley", "Longview", "Meadowlark",
];

const SUFFIXES = [
  "Labs", "Systems", "Technologies", "Group", "Digital", "Cloud",
  "Analytics", "Partners", "Works", "Collective",
];

const PLANS: Plan[] = ["Starter", "Growth", "Enterprise"];
const STATUSES: SubscriptionStatus[] = [
  "active",
  "trialing",
  "past_due",
  "canceled",
];

function weightedIndex(weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return i;
  }
  return weights.length - 1;
}

function generateSubscriptions(): Subscription[] {
  const combos: string[] = [];
  for (const p of PREFIXES) for (const s of SUFFIXES) combos.push(`${p} ${s}`);
  // deterministic shuffle
  for (let i = combos.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [combos[i], combos[j]] = [combos[j], combos[i]];
  }

  const count = 340;
  const now = Date.now();
  const subs: Subscription[] = [];
  for (let i = 0; i < count; i++) {
    const plan = PLANS[weightedIndex([0.25, 0.45, 0.3])];
    const mrr =
      plan === "Starter"
        ? 49 + Math.floor(rng() * 15) * 10
        : plan === "Growth"
          ? 290 + Math.floor(rng() * 121) * 10
          : 2400 + Math.floor(rng() * 961) * 10;

    const statusRoll = rng();
    const status =
      statusRoll < 0.78
        ? STATUSES[0]
        : statusRoll < 0.87
          ? STATUSES[1]
          : statusRoll < 0.95
            ? STATUSES[2]
            : STATUSES[3];

    const health =
      status === "active"
        ? 68 + Math.floor(rng() * 31)
        : status === "trialing"
          ? 45 + Math.floor(rng() * 30)
          : status === "past_due"
            ? 25 + Math.floor(rng() * 30)
            : 5 + Math.floor(rng() * 25);

    const seats =
      plan === "Enterprise"
        ? 120 + Math.floor(rng() * 680)
        : plan === "Growth"
          ? 25 + Math.floor(rng() * 175)
          : 3 + Math.floor(rng() * 22);

    const startOffset = Math.floor(rng() * 1095);
    const startDate = new Date(now - startOffset * 86400000)
      .toISOString()
      .slice(0, 10);

    subs.push({
      id: `sub_${String(i + 1).padStart(4, "0")}`,
      company: combos[i],
      plan,
      mrr,
      status,
      health,
      seats,
      startDate,
    });
  }

  subs.sort((a, b) => b.startDate.localeCompare(a.startDate));
  return subs;
}

let subsCache: Subscription[] | null = null;

export function getSubscriptions(): Subscription[] {
  if (!subsCache) subsCache = generateSubscriptions();
  return subsCache;
}

export function countActive(): number {
  return getSubscriptions().filter((s) => s.status === "active").length;
}

/* --------------------------------- metrics -------------------------------- */

const COMPARISON_LABELS: Record<Range, string> = {
  "7d": "vs 7 days ago",
  "30d": "vs 30 days ago",
  "12m": "vs 12 months ago",
};

const deltaPct = (from: number, to: number) => ((to - from) / from) * 100;

function sparkline(start: number, end: number, points: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < points; i++) {
    const t = points === 1 ? 1 : i / (points - 1);
    const v = start + (end - start) * t + (rng() - 0.5) * Math.abs(end) * 0.012;
    out.push(Math.round(v * 10) / 10);
  }
  return out;
}

export function getMetrics(range: Range): Metric[] {
  const series = getTrendSeries(range);
  const first = series[0];
  const last = series[series.length - 1];
  const mrr = last.totalMrr;
  const mrrDelta = deltaPct(first.totalMrr, last.totalMrr);

  const active = countActive();
  const activeDelta = range === "7d" ? 0.4 : range === "30d" ? 1.6 : 14.2;
  const nrr = 112.4;
  const nrrDelta = range === "7d" ? 0.1 : range === "30d" ? 0.6 : 2.4;
  const sparkPoints = range === "12m" ? 12 : 10;

  return [
    {
      id: "mrr",
      label: "Monthly Recurring Revenue",
      value: mrr,
      format: "currency",
      delta: mrrDelta,
      deltaUnit: "%",
      comparisonLabel: COMPARISON_LABELS[range],
      spark: series.map((p) => p.totalMrr),
    },
    {
      id: "arr",
      label: "Annual Run Rate",
      value: mrr * 12,
      format: "currency",
      delta: mrrDelta,
      deltaUnit: "%",
      comparisonLabel: COMPARISON_LABELS[range],
      spark: series.map((p) => p.totalMrr * 12),
    },
    {
      id: "active",
      label: "Active Subscriptions",
      value: active,
      format: "number",
      delta: activeDelta,
      deltaUnit: "%",
      comparisonLabel: COMPARISON_LABELS[range],
      spark: sparkline(
        Math.round(active / (1 + activeDelta / 100)),
        active,
        sparkPoints,
      ),
    },
    {
      id: "nrr",
      label: "Net Revenue Retention",
      value: nrr,
      format: "percent",
      delta: nrrDelta,
      deltaUnit: "pts",
      comparisonLabel: COMPARISON_LABELS[range],
      spark: sparkline(nrr - nrrDelta, nrr, sparkPoints),
    },
  ];
}

/* --------------------------------- helpers -------------------------------- */

export const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const API_ERROR_MESSAGE =
  "Revenue data service is temporarily unavailable. Please retry in a moment.";
