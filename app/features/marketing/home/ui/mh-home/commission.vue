<template>
  <!-- §05 Commission a Programme (d2): the dark green band. -->
  <section
    :id="HOME_SECTION_IDS.commission"
    tabindex="-1"
    aria-labelledby="commission-heading"
    data-surface="dark"
    class="sheet bg-forest-deep text-white"
  >
    <div class="site-container section-y">
      <!-- Row 1: dashboard panel + the four features as a typographic list. -->
      <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div class="rounded-card bg-forest-night p-3 sm:p-6 lg:col-span-6 lg:p-8">
          <MhHomeCohortDashboardCard />
        </div>

        <div class="lg:col-span-6 lg:pl-4">
          <p
            class="inline-flex min-h-7 items-center rounded-full bg-sheet px-3 py-1 font-heading text-eyebrow font-semibold text-ember uppercase"
          >
            {{ copy.label }}
          </p>
          <ul :aria-label="MICROCOPY.a11y.commissionFeaturesLabel" class="mt-6 flex flex-col">
            <li
              v-for="(feature, i) in copy.features"
              :key="feature.text"
              :class="
                cn(
                  'mh-feature flex items-center gap-4 border-b border-white/10 py-4 font-heading text-[clamp(1.25rem,0.95rem+1.1vw,1.875rem)] leading-tight font-medium tracking-[-0.01em] last:border-b-0',
                  i === 0 ? 'text-white' : 'text-moss',
                )
              "
            >
              <NIcon :name="feature.icon" :size="28" class="shrink-0 text-mint" />
              <span>{{ feature.text }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Row 2: the heading, the three body paragraphs as cards, the two CTAs. -->
      <MhHomeSectionHead
        heading-id="commission-heading"
        :lead="HEADLINE[0]"
        :trail="HEADLINE[1]"
        tone="dark"
        class="mt-20 lg:mt-28"
      />

      <ul class="mt-12 grid grid-cols-1 gap-3 md:grid-cols-3 lg:gap-4">
        <li
          v-for="(para, i) in copy.body"
          :key="para"
          class="flex flex-col rounded-card border border-white/10 bg-forest-night p-6 sm:p-7"
        >
          <span
            aria-hidden="true"
            class="inline-flex size-11 items-center justify-center rounded-sm bg-mint text-forest-deep"
          >
            <NIcon :name="BODY_ICONS[i]!" :size="22" />
          </span>
          <p class="mt-8 text-copy text-white/85">{{ para }}</p>
        </li>
      </ul>

      <div class="mt-10 flex flex-col justify-center gap-3 xs:flex-row xs:flex-wrap">
        <NButton :to="copy.ctaPrimary.to" color="accent" size="lg">
          {{ copy.ctaPrimary.label }}
          <NIcon name="arrow-right" :size="18" />
        </NButton>
        <NButton :to="copy.ctaSecondary.to" color="inverse" variant="outline" size="lg">
          <NIcon name="download" :size="18" />
          {{ copy.ctaSecondary.label }}
        </NButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * §05 Commission a Programme (d2). One of the three dark surfaces (hero, this band, footer).
 * The programme dashboard is the sample's photo slot; every figure in it says "Sample data".
 * Features: first line white, the rest moss (5:1 on the band, large text), lifting to white
 * on hover.
 */
import { cn } from "~/utils/utils";
import type { IconName } from "~/utils/icons";
import { COMMISSION_COPY } from "../../domain/home-copy";
import { HOME_SECTION_IDS } from "../../domain/home-routes";
import { MICROCOPY } from "../../domain/home-microcopy";
import { splitCopy } from "../../domain/split-copy";

const copy = COMMISSION_COPY;
const HEADLINE = splitCopy(copy.headline, "monitor, and report on.");
const BODY_ICONS: readonly IconName[] = ["organisation", "documentation", "audit-report"];
</script>

<style scoped>
.mh-feature {
  transition: color 200ms var(--ease-out-soft);
}
.mh-feature:hover {
  color: #ffffff;
}
</style>
