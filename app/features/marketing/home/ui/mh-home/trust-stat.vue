<template>
  <!-- One stat card: mint icon tile top-left, then (pushed to the foot) the figure, label and
       sub-label — the sample's "problem card" anatomy. -->
  <li
    :class="
      cn(
        'flex min-h-[15rem] flex-col rounded-card border border-hairline bg-card p-5 transition-shadow duration-200 ease-out-soft hover:shadow-lift sm:p-6',
        props.class,
      )
    "
  >
    <span
      aria-hidden="true"
      class="inline-flex size-11 items-center justify-center rounded-sm bg-mint text-forest-deep"
    >
      <NIcon :name="props.stat.icon" :size="22" />
    </span>
    <p
      class="tabular mt-auto pt-8 font-heading text-figure font-bold whitespace-nowrap text-forest"
    >
      <span ref="valueEl" aria-hidden="true">{{ display }}</span>
      <span class="sr-only">{{ props.stat.number }}</span>
    </p>
    <p class="mt-3 font-heading text-base font-semibold text-ink">{{ props.stat.label }}</p>
    <p class="mt-1 text-[0.9375rem] leading-snug text-body">{{ props.stat.subLabel }}</p>
  </li>
</template>

<script setup lang="ts">
/** §03 stat. 350+ and 45+ count up once on view; the final value is always in the HTML. */
import { computed, ref, type HTMLAttributes } from "vue";
import { cn } from "~/utils/utils";
import type { TrustStat } from "../../domain/home-copy";

const props = defineProps<{ stat: TrustStat; class?: HTMLAttributes["class"] }>();

const valueEl = ref<HTMLElement | null>(null);
const count = props.stat.countTo !== undefined ? useMhCountUp(valueEl, props.stat.countTo) : null;

const display = computed(() =>
  count ? `${props.stat.prefix ?? ""}${count.value}${props.stat.suffix ?? ""}` : props.stat.number,
);
</script>
