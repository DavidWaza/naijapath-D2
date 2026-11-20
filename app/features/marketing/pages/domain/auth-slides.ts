/**
 * Slides for the auth photo panel (d2). Built ONLY from the brief's approved copy — no invented
 * quotes, names or job titles. `highlight` is the tail of the locked sentence, set in the serif
 * accent; `splitCopy` throws if the sentence ever changes so the two parts no longer join.
 */
import {
  BENEFICIARIES_COPY,
  HERO_COPY,
  SOCIAL_PROOF_COPY,
  TRUST_STATS,
} from "../../home/domain/home-copy";
import { MICROCOPY } from "../../home/domain/home-microcopy";
import { splitCopy } from "../../home/domain/split-copy";

export interface AuthSlide {
  lead: string;
  highlight: string;
  title: string;
  caption: string;
  image: { src: string; position: string };
}

const stage = TRUST_STATS.find((s) => s.number === "5-Stage")!;

const toSlide = (
  sentence: string,
  tail: string,
  title: string,
  caption: string,
  image: AuthSlide["image"],
): AuthSlide => {
  const [lead, highlight] = splitCopy(sentence, tail);
  return { lead, highlight, title, caption, image };
};

// CLIENT PHOTO SLOTS — the two licensed photos in IMAGE_CREDITS.md, cropped differently.
export const AUTH_SLIDES: readonly AuthSlide[] = [
  toSlide(
    HERO_COPY.headline,
    "structured, verified guidance.",
    HERO_COPY.tag,
    MICROCOPY.footer.locationPill,
    { src: "/images/hero-session.jpg", position: "58% 40%" },
  ),
  toSlide(
    BENEFICIARIES_COPY.headline,
    "who documents your progress.",
    BENEFICIARIES_COPY.label,
    BENEFICIARIES_COPY.supportingNote,
    { src: "/images/beneficiary-session.jpg", position: "38% 50%" },
  ),
  toSlide(
    SOCIAL_PROOF_COPY.headline,
    "Impact you can verify.",
    `${stage.number} ${stage.label}`,
    stage.subLabel,
    { src: "/images/hero-session.jpg", position: "30% 60%" },
  ),
];
