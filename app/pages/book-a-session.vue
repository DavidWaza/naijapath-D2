<template>
  <div class="min-h-svh bg-cream p-[var(--sheet-inset)]">
    <NSkipLink target="main">{{ MICROCOPY.a11y.skipLink }}</NSkipLink>

    <main
      id="main"
      tabindex="-1"
      class="grid min-h-[calc(100svh-2*var(--sheet-inset))] grid-cols-1 items-start gap-3 rounded-sheet bg-sheet p-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      <!-- Left: the dark green panel. Sticky beside the (longer) form on desktop. -->
      <aside
        data-surface="dark"
        class="relative isolate flex flex-col overflow-clip rounded-[1.25rem] bg-forest-deep p-6 text-white sm:p-8 lg:sticky lg:top-[calc(var(--sheet-inset)+0.75rem)] lg:min-h-[calc(100svh-2*var(--sheet-inset)-1.5rem)] xl:p-12"
      >
        <!-- The path motif (decorative). -->
        <svg
          aria-hidden="true"
          viewBox="0 0 400 700"
          preserveAspectRatio="none"
          class="pointer-events-none absolute inset-0 -z-10 size-full max-w-none opacity-60"
        >
          <path
            d="M420 40 C 300 120, 360 260, 240 320 S 60 420, 120 560 S 260 690, 180 760"
            fill="none"
            stroke="var(--forest)"
            stroke-width="1.5"
            vector-effect="non-scaling-stroke"
          />
        </svg>

        <div class="flex items-center justify-between gap-4">
          <NLink
            :to="PAGES_ROUTES.home"
            :aria-label="MICROCOPY.a11y.homeLink"
            class="inline-flex min-h-11 items-center rounded-sm"
          >
            <NLogo tone="inverse" />
          </NLink>
        </div>

        <div class="mt-12 lg:mt-auto lg:pt-16">
          <p
            class="inline-flex min-h-7 items-center rounded-full bg-white/10 px-3 py-1 font-heading text-eyebrow font-semibold text-moss uppercase"
          >
            {{ t.eyebrow }}
          </p>
          <h1
            id="session-form-heading"
            class="mt-5 max-w-[16ch] font-heading text-[clamp(2rem,1.3rem+2vw,3rem)] leading-[1.08] font-semibold tracking-[-0.02em] text-white"
          >
            {{ TITLE[0] }}
            <span class="font-serif font-normal tracking-normal text-ember-soft italic">{{
              TITLE[1]
            }}</span>
          </h1>
          <p class="mt-5 max-w-[42ch] text-base leading-relaxed text-white/80">{{ t.lead }}</p>
        </div>

        <!-- What happens next: three steps on a thin path. -->
        <div class="mt-10 border-t border-white/15 pt-8 lg:mt-12">
          <h2 class="font-heading text-sm font-semibold tracking-[0.05em] text-moss uppercase">
            {{ t.stepsTitle }}
          </h2>
          <ol class="relative mt-6 flex flex-col gap-6">
            <span
              aria-hidden="true"
              class="absolute top-4 bottom-4 left-[0.9375rem] w-px bg-white/20"
            />
            <li v-for="(step, i) in t.steps" :key="step" class="relative flex items-start gap-4">
              <span
                aria-hidden="true"
                class="tabular inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-mint text-xs font-semibold text-forest-deep ring-4 ring-forest-deep"
                >{{ String(i + 1).padStart(2, "0") }}</span
              >
              <span class="pt-1 text-[0.9375rem] leading-snug text-white/90">{{ step }}</span>
            </li>
          </ol>
        </div>

        <!-- One approved fact, as a quiet footnote. -->
        <p
          class="mt-10 hidden items-center gap-3 rounded-lg bg-white/[0.06] px-4 py-3 text-sm text-white/80 lg:flex"
        >
          <NIcon name="delivery-standard" :size="20" class="shrink-0 text-mint" />
          <span>
            <span class="font-semibold text-white">{{ STAGE.number }} {{ STAGE.label }}</span>
            · {{ STAGE.subLabel }}
          </span>
        </p>
      </aside>

      <!-- Right: the form. -->
      <div class="flex min-w-0 flex-col px-3 pt-3 pb-2 sm:px-8 lg:px-12 xl:px-16">
        <nav
          :aria-label="MICROCOPY.a11y.primaryNav"
          class="flex flex-wrap items-center justify-between gap-2"
        >
          <NLink
            :to="PAGES_ROUTES.home"
            class="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink"
          >
            <NIcon
              name="arrow-left"
              :size="18"
              class="transition-transform duration-200 ease-out-soft group-hover:-translate-x-1"
            />
            {{ PAGES_MICROCOPY.shell.backHome }}
          </NLink>
          <div class="flex items-center gap-1">
            <NButton :to="PAGES_ROUTES.contact" color="light" variant="ghost" size="sm">
              {{ MICROCOPY.nav.contact }}
            </NButton>
            <NButton :to="PAGES_ROUTES.signIn" color="light" variant="outline" size="sm">
              {{ NAV_COPY.ctaGhost.label }}
            </NButton>
          </div>
        </nav>

        <div class="mx-auto w-full max-w-[40rem] py-10 lg:py-16">
          <MpPagesSessionRequestForm />
        </div>

        <footer
          class="mt-auto flex flex-col gap-1 border-t border-hairline pt-4 text-sm text-muted sm:flex-row sm:justify-between"
        >
          <p>{{ FOOTER_COPY.tagline }}</p>
          <p>{{ FOOTER_COPY.copyright }}</p>
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Book a session (d2): a sticky dark green panel (title with a serif accent, the three
 * "what happens next" steps on a thin path, one approved fact) beside the request form.
 * A request, not live scheduling: the team confirms the time by email.
 */
import { FOOTER_COPY, NAV_COPY, TRUST_STATS } from "~/features/marketing/home/domain/home-copy";
import { MICROCOPY } from "~/features/marketing/home/domain/home-microcopy";
import { splitCopy } from "~/features/marketing/home/domain/split-copy";
import { PAGES_MICROCOPY } from "~/features/marketing/pages/domain/pages-microcopy";
import { PAGES_ROUTES } from "~/features/marketing/pages/domain/pages-routes";

const t = PAGES_MICROCOPY.sessionRequest;
const TITLE = splitCopy(t.title, "career guidance session");
const STAGE = TRUST_STATS.find((s) => s.number === "5-Stage")!;
const { siteUrl } = useRuntimeConfig().public;

useSeoMeta({
  title: t.metaTitle,
  description: t.metaDescription,
  ogTitle: t.metaTitle,
  ogDescription: t.metaDescription,
  ogUrl: `${siteUrl}${PAGES_ROUTES.bookSession}`,
});
useHead({ link: [{ rel: "canonical", href: `${siteUrl}${PAGES_ROUTES.bookSession}` }] });
</script>
