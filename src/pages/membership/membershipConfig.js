// ── Tier config ───────────────────────────────────────────────────────────────
export const TIER_CFG = {
  Platinum: {
    icon: "💎", label: "Platinum",
    minSpend: 5000000,
    multiplier: 2.0,
    discount: 20,
    bg: "bg-purple-100", text: "text-purple-700",
    border: "border-purple-200", bar: "bg-purple-500",
    darkBg: "bg-purple-600",
  },
  Gold: {
    icon: "🥇", label: "Gold",
    minSpend: 1500000,
    multiplier: 1.5,
    discount: 10,
    bg: "bg-yellow-100", text: "text-yellow-700",
    border: "border-yellow-200", bar: "bg-yellow-400",
    darkBg: "bg-yellow-500",
  },
  Silver: {
    icon: "🥈", label: "Silver",
    minSpend: 0,
    multiplier: 1.0,
    discount: 5,
    bg: "bg-gray-100", text: "text-gray-600",
    border: "border-gray-200", bar: "bg-gray-400",
    darkBg: "bg-gray-500",
  },
};

export const STATUS_CFG = {
  Active:   { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500"  },
  Expiring: { bg: "bg-orange-100", text: "text-orange-600", dot: "bg-orange-400" },
  Expired:  { bg: "bg-red-100",    text: "text-red-600",    dot: "bg-red-500"    },
};

// Points per Rp10.000 base (multiplied by tier)
export const BASE_POINT_PER_10K = 1;
export const POINT_VALUE_RP = 100; // 1 point = Rp 100

// Excluded products from points
export const EXCLUDED_PRODUCTS = [
  "Narkotika & Psikotropika",
  "Obat Program BPJS",
  "Obat Pita Merah Keras",
  "Vaksin Subsidi",
];

export const ALL_TAGS = ["Diabetes", "Hipertensi", "Vitamin Bulanan", "Ibu & Anak"];

export function getTierBySpend(annualSpend) {
  if (annualSpend >= TIER_CFG.Platinum.minSpend) return "Platinum";
  if (annualSpend >= TIER_CFG.Gold.minSpend) return "Gold";
  return "Silver";
}

export function getNextTier(tier) {
  if (tier === "Silver") return "Gold";
  if (tier === "Gold") return "Platinum";
  return null;
}

export function getSpendToNextTier(tier, currentSpend) {
  const next = getNextTier(tier);
  if (!next) return 0;
  return Math.max(0, TIER_CFG[next].minSpend - currentSpend);
}

export function fmtRp(n) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}
