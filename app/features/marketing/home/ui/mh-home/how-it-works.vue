<template>
  <!-- §06 How NaijaPath Works (d2): centred head; then a sticky stage index on the left (the
       path: a thin line whose green fill follows the stage in view) and five stage cards. -->
  <section
    :id="HOME_SECTION_IDS.howItWorks"
    tabindex="-1"
    aria-labelledby="how-heading"
    class="section-y"
  >
    <div class="site-container">
      <MhHomeSectionHead
        heading-id="how-heading"
        :label="copy.label"
        :lead="HEADLINE[0]"
        :trail="HEADLINE[1]"
        :sub="copy.subheadline"
      />

      <div class="mt-12 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-10">
        <!-- Stage index (desktop): links that jump to each stage card. -->
        <nav :aria-label="MICROCOPY.a11y.stagesNav" class="hidden lg:col-span-3 lg:block">
          <div class="sticky top-28">
            <span aria-hidden="true" class="absolute top-6 bottom-6 left-[1.6rem] w-px bg-hairline">
              <span
                class="mh-path absolute inset-x-0 top-0 bg-forest"
                :style="{ height: `${(active / (copy.stages.length - 1)) * 100}%` }"
              />
            </span>
            <ol class="relative">
              <li v-for="(stage, i) in copy.stages" :key="stage.number" class="relative">
                <a
                  :href="`#${stageId(i)}`"
                  :aria-current="i === active ? 'step' : undefined"
                  :class="
                    cn(
                      'flex min-h-12 items-center gap-4 rounded-lg px-3 font-heading text-[0.9375rem] font-medium transition-colors duration-200 ease-out-soft',
                      i === active ? 'bg-card text-ink shadow-soft' : 'text-body hover:text-ink',
                    )
                  "
                  @click.prevent="goTo(i)"
                >
                  <span
                    :class="
                      cn(
                        'tabular relative z-10 inline-flex size-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-200 ease-out-soft',
                        i <= active
                          ? 'border-forest bg-forest text-white'
                          : 'border-hairline bg-cream text-body',
                      )
                    "
                    >{{ stage.number }}</span
                  >
                  {{ stage.name }}
                </a>
              </li>
            </ol>
          </div>
        </nav>

        <!-- The five stages. -->
        <ol :aria-label="MICROCOPY.a11y.stagesListLabel" class="flex flex-col gap-4 lg:col-span-9">
          <li
            v-for="(stage, i) in copy.stages"
            :id="stageId(i)"
            :key="stage.number"
            :ref="(el) => setStage(el as HTMLElement | null, i)"
            tabindex="-1"
            class="grid grid-cols-1 gap-3 rounded-card border border-hairline bg-card p-3 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] sm:gap-6"
          >
            <!-- Number tile: mint field, contour texture, the stage number set large. -->
            <div
              aria-hidden="true"
              class="mh-contour relative flex min-h-36 items-end justify-between overflow-hidden rounded-[0.75rem] bg-mint-50 p-5 sm:aspect-[16/11] sm:min-h-0"
            >
              <span
                class="tabular font-heading text-[clamp(4.5rem,3rem+5vw,7.5rem)] leading-[0.8] font-bold tracking-[-0.04em] text-forest/30"
                >{{ stage.number }}</span
              >
              <span
                class="inline-flex size-12 items-center justify-center rounded-full bg-sheet text-forest shadow-soft"
              >
                <NIcon :name="STAGE_ICONS[i]!" :size="24" />
              </span>
            </div>

            <div class="flex flex-col px-2 pt-1 pb-3 sm:px-0 sm:py-4 sm:pr-4">
              <p
                aria-hidden="true"
                class="tabular inline-flex w-fit items-center rounded-full bg-mint px-2.5 py-1 font-heading text-xs font-semibold text-forest-deep"
              >
                {{ MICROCOPY.stagePill }} · {{ stage.number }}
              </p>
              <h3 class="mt-4 text-subtitle font-semibold text-ink">
                <span class="sr-only">Stage {{ stage.number }}: </span>{{ stage.name }}
              </h3>
              <p class="measure mt-3 text-copy text-body">{{ stage.copy }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * §06 How NaijaPath Works (d2). The "path" signature: on desktop the index line fills green up
 * to the stage crossing the middle of the viewport. IntersectionObserver only (no scroll
 * library). Reduced motion: the fill simply jumps (the global rule removes the transition).
 */
import { onBeforeUnmount, onMounted, ref } from "vue";
import { cn } from "~/utils/utils";
import type { IconName } from "~/utils/icons";
import { scrollToSection } from "~/utils/scroll";
import { HOW_IT_WORKS_COPY } from "../../domain/home-copy";
import { HOME_SECTION_IDS } from "../../domain/home-routes";
import { MICROCOPY } from "../../domain/home-microcopy";
import { splitCopy } from "../../domain/split-copy";

const copy = HOW_IT_WORKS_COPY;
const HEADLINE = splitCopy(copy.headline, "the same quality process.");
const STAGE_ICONS: readonly IconName[] = [
  "calendar-check",
  "audit-report",
  "message",
  "documentation",
  "dashboard",
];

const stageId = (i: number) => `stage-${copy.stages[i]!.number}`;
const stages: HTMLElement[] = [];
const setStage = (el: HTMLElement | null, i: number) => {
  if (el) stages[i] = el;
};

const active = ref(0);
let io: IntersectionObserver | undefined;

function goTo(i: number) {
  scrollToSection(stageId(i));
}

onMounted(() => {
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) active.value = stages.indexOf(e.target as HTMLElement);
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  for (const el of stages) io.observe(el);
});
onBeforeUnmount(() => io?.disconnect());
</script>

<style scoped>
.mh-path {
  transition: height 600ms var(--ease-out-soft);
}

/* Faint topographic contour lines on the mint tile (brief: "texture with restraint"). */
.mh-contour::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='200' viewBox='0 0 240 200' fill='none' stroke='%23CFE3D6' stroke-width='1.2'%3E%3Cpath d='M-10 40c40-20 80 20 120 0s80-30 140-5'/%3E%3Cpath d='M-10 70c40-20 80 22 120 2s80-30 140-6'/%3E%3Cpath d='M-10 100c40-22 80 24 120 4s80-32 140-8'/%3E%3Cpath d='M-10 130c40-22 80 26 120 6s80-32 140-10'/%3E%3Cpath d='M-10 160c40-24 80 28 120 8s80-34 140-12'/%3E%3Cpath d='M-10 190c40-24 80 30 120 10s80-34 140-14'/%3E%3C/svg%3E");
  background-size: 240px 200px;
}
.mh-contour > * {
  position: relative;
}
</style>
