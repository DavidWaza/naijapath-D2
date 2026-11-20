<template>
  <!-- §02 Hero (d2): a dark green frame inset from the viewport. Copy left (two-tone H1), a
       tilted photo card right with a mint backing card behind it. The header floats inside the
       frame's top edge. -->
  <section
    :id="HOME_SECTION_IDS.hero"
    aria-labelledby="hero-heading"
    data-surface="dark"
    class="sheet relative isolate mt-[var(--sheet-inset)] overflow-clip bg-forest-deep text-white"
  >
    <!-- The path motif: one thin line threading five stage nodes (decorative, static SVG). -->
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 600"
      preserveAspectRatio="none"
      class="mh-hero-path pointer-events-none absolute inset-0 -z-10 size-full max-w-none"
    >
      <path
        d="M-20 520 C 160 500, 220 380, 360 400 S 560 520, 700 420 S 900 200, 1040 230 S 1180 120, 1240 60"
        fill="none"
        stroke="var(--forest)"
        stroke-width="1.5"
        vector-effect="non-scaling-stroke"
        pathLength="1"
        class="mh-hero-path-line"
      />
    </svg>

    <div
      class="site-container grid grid-cols-1 items-center gap-12 pt-32 pb-12 sm:pt-40 lg:min-h-[min(84svh,46rem)] lg:grid-cols-12 lg:gap-8 lg:pt-36 lg:pb-16"
    >
      <!-- Copy -->
      <div class="lg:col-span-7">
        <h1 id="hero-heading" class="text-hero-v font-semibold text-white">
          <span class="mh-rise block [--d:120ms]">{{ HEADLINE[0] }}</span>
          <span class="mh-rise block text-moss [--d:240ms]">{{ HEADLINE[1] }}</span>
        </h1>
        <p class="mh-rise measure mt-6 text-lg leading-relaxed text-white/80 [--d:360ms]">
          {{ copy.tag }}
        </p>
        <div class="mh-rise mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap [--d:480ms]">
          <NButton :to="copy.ctaPrimary.to" color="inverse" shape="pill" size="lg">
            {{ copy.ctaPrimary.label }}
            <NIcon name="arrow-right" :size="18" />
          </NButton>
          <NButton
            :to="copy.ctaSecondary.to"
            color="inverse"
            variant="outline"
            shape="pill"
            size="lg"
          >
            {{ copy.ctaSecondary.label }}
          </NButton>
        </div>
        <p class="mh-rise mt-8 inline-flex items-center gap-2 text-sm text-white/75 [--d:600ms]">
          <NIcon name="map-pin" :size="16" class="text-moss" />
          {{ MICROCOPY.footer.locationPill }}
        </p>
      </div>

      <!-- Photo card: tilted white card on a mint backing card. -->
      <div class="relative mx-auto w-full max-w-[33rem] lg:col-span-5 lg:col-start-8">
        <div
          aria-hidden="true"
          class="absolute inset-0 translate-x-3 translate-y-3 rotate-[4deg] rounded-card bg-mint sm:translate-x-5 sm:translate-y-4"
        />
        <figure
          class="relative grid -rotate-[2deg] grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-3 rounded-card bg-sheet p-3 text-ink shadow-lift sm:gap-4"
        >
          <div class="relative">
            <NuxtPicture
              :src="HERO_IMAGE"
              :alt="MICROCOPY.images.hero"
              width="640"
              height="800"
              fit="cover"
              sizes="xs:60vw sm:300px lg:22vw xl:300px"
              format="avif,webp"
              legacy-format="jpeg"
              :preload="{ fetchPriority: 'high' }"
              loading="eager"
              :img-attrs="{
                class: 'aspect-[4/5] size-full rounded-[0.75rem] object-cover object-[42%_40%]',
                fetchpriority: 'high',
              }"
            />
            <!-- Seal on the photo's edge. -->
            <span
              aria-hidden="true"
              class="absolute top-1/2 -right-5 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-ember text-white ring-4 ring-sheet sm:-right-7 sm:size-16"
            >
              <NIcon name="calendar-check" :size="26" />
            </span>
          </div>

          <!-- Badges 1 + 2 (brief §02), as real UI on the card. -->
          <figcaption class="flex min-w-0 flex-col justify-between py-2 pr-1 pl-3 sm:pl-5">
            <ul :aria-label="MICROCOPY.a11y.heroBadgesLabel" class="contents">
              <li class="flex flex-col gap-1.5">
                <span
                  class="tabular font-heading text-[clamp(1.75rem,1.2rem+2vw,2.5rem)] leading-none font-bold tracking-[-0.02em] text-ink"
                  >{{ copy.badge2.score }}</span
                >
                <NRating :value="copy.badge2.rating" :size="14" />
                <span class="text-sm leading-snug text-body">{{ copy.badge2.text }}</span>
              </li>
              <li
                class="mt-6 inline-flex items-start gap-2 border-t border-hairline pt-4 text-sm leading-snug font-medium text-forest-deep"
              >
                <NIcon name="check-circle" :size="18" class="mt-px text-forest" />
                <span>{{ copy.badge1 }}</span>
              </li>
            </ul>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * §02 Hero (d2). Dark green frame; the approved headline set as its two lines, the second in
 * the muted moss tone; the tag as the supporting line; two pill CTAs (the only pills on the
 * page). The photo card carries Badge 2 (rating) and Badge 1 (funded seats). The photo is the
 * LCP element (preloaded, eager, high priority).
 *
 * The subheadline is re-homed as the title of the next section (§03), as in the variant
 * blueprint — still locked copy, shown once.
 */
import { HERO_COPY } from "../../domain/home-copy";
import { HOME_SECTION_IDS } from "../../domain/home-routes";
import { MICROCOPY } from "../../domain/home-microcopy";
import { splitCopy } from "../../domain/split-copy";

const copy = HERO_COPY;
// CLIENT PHOTO SLOT — replace with the client's own shoot at the same path.
const HERO_IMAGE = "/images/hero-session.jpg";
const HEADLINE = splitCopy(copy.headline, "structured, verified guidance.");
</script>

<style scoped>
.mh-hero-path-line {
  opacity: 0.55;
  stroke-dasharray: 1 1;
}

@media (prefers-reduced-motion: no-preference) {
  .mh-hero-path-line {
    animation: mh-draw 1600ms var(--ease-out-soft) 200ms both;
  }
  .mh-rise {
    animation: mh-rise 600ms var(--ease-out-soft) both;
    animation-delay: var(--d, 0ms);
  }
}
@keyframes mh-draw {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes mh-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>
