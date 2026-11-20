// WCAG 2.2 contrast audit for every foreground/background pair used on the homepage.
// Run: npm run contrast   — exits non-zero if any pair fails its threshold.
// Thresholds: 4.5 = normal text (AA), 3 = large text (≥24px, or ≥18.66px bold) and UI components / graphics.

const T = {
  // d2 palette (app/assets/css/tailwind.css)
  cream: "#F6F4EE",
  card: "#FBFAF7",
  sheet: "#FFFFFF",
  hairline: "#E6E2D8",
  forest: "#1B6B3A",
  "forest-deep": "#1B3A2D",
  "forest-night": "#15302A",
  ember: "#B5451B",
  "ember-deep": "#963614",
  mint: "#CFE3D6",
  "mint-50": "#F0F7F2",
  sage: "#E8F0EB",
  sand: "#FBEFEA",
  "sand-150": "#F3D9CE",
  ink: "#1A1A1A",
  body: "#374151",
  muted: "#636A76",
  moss: "#8FAE9A",
  "ember-soft": "#F2B497",
  white: "#FFFFFF",
  // functional
  "success-50": "#F0FDF4",
  "success-500": "#15803D",
  "danger-100": "#FECACA",
  "danger-500": "#B91C1C",
  "amber-500": "#D97706",
};

const hex = (h) => {
  const v = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
};
const blend = (fg, bg, a) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
const lum = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].toSorted((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// [foreground token, foreground alpha, background token, min ratio, where it is used]
// redesign-v3 palette. Text pairs need 4.5 (3 for large text ≥24px); UI and graphics need 3.
const PAIRS = [
  // ── Text on light surfaces ──
  ["ink", 1, "cream", 4.5, "Headings on the cream ground"],
  ["ink", 1, "card", 4.5, "Headings on stat / stage cards"],
  ["muted", 1, "cream", 4.5, "Second tone of light headlines; For You note"],
  ["body", 1, "cream", 4.5, "Body copy on cream"],
  ["body", 1, "card", 4.5, "Body copy on cards"],
  ["body", 1, "sheet", 4.5, "Body copy on white (session record, dashboard)"],
  ["muted", 1, "sheet", 4.5, "Supporting text on white cards"],
  ["forest", 1, "card", 4.5, "Stat figures; text links"],
  ["forest", 1, "mint-50", 4.5, "Beneficiaries card eyebrow + link"],
  ["forest-deep", 1, "mint", 4.5, "Stage pill text; icon tiles"],
  ["ember", 1, "sand", 4.5, "FOR YOU pill; practitioner card eyebrow + link"],
  ["ember", 1, "sheet", 4.5, "COMMISSION WITH CONFIDENCE pill"],
  ["ink", 1, "sand", 4.5, "Practitioner card headline"],
  ["body", 1, "sand", 4.5, "Practitioner card body"],
  ["body", 1, "mint-50", 4.5, "Beneficiary card body"],
  ["body", 0.9, "cream", 4.5, "Section pill text on ink/6% (approx.)"],
  // ── Text on the dark green fields (hero, Commission, footer, Organisations card) ──
  ["white", 1, "forest-deep", 4.5, "White text on dark green"],
  ["white", 0.75, "forest-deep", 4.5, "75% white supporting text"],
  ["moss", 1, "forest-deep", 4.5, "Second tone of dark headlines; features; footer headers"],
  ["moss", 1, "forest-night", 4.5, "Moss on dark cards"],
  ["white", 0.85, "forest-night", 4.5, "Paragraph text on dark cards"],
  ["ember-soft", 1, "forest-deep", 4.5, "Auth panel serif highlight (over the scrim)"],
  ["white", 0.8, "forest-deep", 4.5, "Auth panel caption"],
  ["muted", 1, "sheet", 4.5, "Auth field rule / hint / placeholder on white"],
  // ── Buttons ──
  ["white", 1, "forest", 4.5, "Primary (green) button"],
  ["white", 1, "ember", 4.5, "Accent (terracotta) button"],
  ["white", 1, "ember-deep", 4.5, "Accent button hover"],
  ["ink", 1, "white", 4.5, "Inverse (white) hero button"],
  ["ink", 1, "mint", 4.5, "Inverse button hover"],
  // ── UI and graphics (3:1) ──
  ["forest", 1, "sheet", 3, "Dashboard bars on white"],
  ["forest", 0.78, "sheet", 3, "Earlier-week bars (78%)"],
  ["mint", 1, "forest-deep", 3, "Icon tiles on dark green"],
  ["white", 1, "ember", 3, "Hero seal icon"],
  ["amber-500", 1, "sheet", 3, "Rating stars"],
  ["forest", 1, "cream", 3, "Focus ring on cream"],
  ["white", 1, "forest-deep", 3, "Focus ring on dark green"],
  ["success-500", 1, "success-50", 4.5, "Completed status pill"],
  ["danger-100", 1, "forest-deep", 4.5, "Newsletter error on dark green"],
];

let failed = 0;
const rows = PAIRS.map(([fg, a, bg, min, where]) => {
  const f = a === 1 ? hex(T[fg]) : blend(hex(T[fg]), hex(T[bg]), a);
  const r = ratio(f, hex(T[bg]));
  const pass = r >= min;
  if (!pass) failed++;
  const fgLabel = a === 1 ? fg : `${fg}@${Math.round(a * 100)}%`;
  return { fg: fgLabel, bg, ratio: r.toFixed(2), min, result: pass ? "PASS" : "FAIL", where };
});

console.table(rows);
if (failed) {
  console.error(`\n${failed} pair(s) FAIL their WCAG 2.2 AA threshold.`);
  process.exit(1);
}
console.log(`\nAll ${rows.length} pairs pass WCAG 2.2 AA.`);
