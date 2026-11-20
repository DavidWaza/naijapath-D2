<template>
  <footer data-surface="dark" class="sheet mb-[var(--sheet-inset)] bg-forest-deep text-white">
    <div class="site-container pt-14 pb-8 lg:pt-20">
      <!-- Top: brand left, Career Brief right. -->
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div class="lg:col-span-5">
          <!-- The path ends here: a thin green line that runs into the logo. -->
          <div class="flex items-center gap-4">
            <span aria-hidden="true" class="hidden h-px w-16 bg-forest sm:block" />
            <NLink
              :to="HOME_ROUTES.home"
              class="-m-1 inline-flex min-h-11 items-center rounded-sm p-1"
              :aria-label="MICROCOPY.a11y.homeLink"
            >
              <NLogo tone="inverse" />
            </NLink>
          </div>
          <p class="mt-5 max-w-[22rem] font-heading text-xl leading-snug font-medium text-white">
            {{ copy.tagline }}
          </p>
          <p
            class="mt-5 inline-flex min-h-8 items-center gap-2 rounded-full bg-white/10 px-3 text-sm font-medium text-white"
          >
            <NIcon name="map-pin" :size="16" class="text-mint" />
            {{ MICROCOPY.footer.locationPill }}
          </p>
          <ul :aria-label="MICROCOPY.a11y.socialLabel" class="mt-6 flex items-center gap-3">
            <li v-for="s in HOME_SOCIAL" :key="s.id">
              <NLink
                v-if="s.href"
                :to="s.href"
                :aria-label="s.label"
                class="inline-flex size-11 items-center justify-center rounded-sm border border-white/15 bg-white/5 text-white transition-colors duration-200 ease-brand hover:bg-white hover:text-forest-deep"
              >
                <NIcon :name="s.id" :size="20" />
              </NLink>
              <!-- URL not supplied yet: a plain glyph, never a dead link. -->
              <span
                v-else
                class="inline-flex size-11 items-center justify-center rounded-sm border border-white/15 bg-white/5 text-white"
                aria-hidden="true"
              >
                <NIcon :name="s.id" :size="20" />
              </span>
            </li>
          </ul>
        </div>
        <div class="lg:col-span-6 lg:col-start-7">
          <!-- Server-rendered; its JS (vee-validate, yup, axios) loads only when the footer
               scrolls into view — keeps ~35 KB gz out of the initial bundle. -->
          <LazyMhHomeNewsletterForm hydrate-on-visible />
        </div>
      </div>

      <nav
        :aria-label="MICROCOPY.a11y.footerNav"
        class="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 sm:grid-cols-3 sm:gap-6 lg:mt-12 lg:pt-12"
      >
        <div v-for="col in copy.columns" :key="col.header">
          <h2 class="font-heading text-sm font-semibold tracking-[0.05em] text-moss uppercase">
            {{ col.header }}
          </h2>
          <ul class="mt-3 flex flex-col">
            <li v-for="link in col.links" :key="link.label">
              <NLink
                :to="link.to"
                class="inline-flex min-h-11 items-center py-1 text-base text-white/85 transition-colors duration-200 ease-brand hover:text-white"
              >
                <span class="link-underline">{{ link.label }}</span>
              </NLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="mt-12 border-t border-white/10 pt-6">
        <p class="text-sm text-white/75">{{ copy.copyright }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
/** §09 Footer (d2) — the third dark green frame; Career Brief, three link columns. */
import { FOOTER_COPY } from "../../domain/home-copy";
import { HOME_ROUTES, HOME_SOCIAL } from "../../domain/home-routes";
import { MICROCOPY } from "../../domain/home-microcopy";

const copy = FOOTER_COPY;
</script>
