<template>
  <!-- d2 section heading: small pill label, then a two-tone H2 (first part ink, the rest muted).
       Both tones live inside ONE <h2>, so the locked sentence is read whole. -->
  <header
    data-slot="section-head"
    :class="
      cn(
        'flex flex-col',
        props.align === 'center' ? 'mx-auto items-center text-center' : 'items-start',
        props.class,
      )
    "
  >
    <p
      v-if="props.label"
      :class="
        cn(
          'inline-flex min-h-7 items-center rounded-full px-3 py-1 font-heading text-eyebrow leading-tight font-semibold tracking-[0.05em] uppercase',
          props.tone === 'dark'
            ? 'bg-white/10 text-moss'
            : props.labelTone === 'terracotta'
              ? 'bg-sand text-ember'
              : 'bg-ink/[0.06] text-body',
        )
      "
    >
      {{ props.label }}
    </p>
    <h2
      :id="props.headingId"
      :class="
        cn(
          'max-w-[24ch] text-title font-semibold',
          props.label && 'mt-5',
          props.wide && 'max-w-[34ch]',
          props.tone === 'dark' ? 'text-white' : 'text-ink',
        )
      "
    >
      {{ props.lead
      }}<template v-if="props.trail"
        >{{ " "
        }}<span :class="props.tone === 'dark' ? 'text-moss' : 'text-muted'">{{
          props.trail
        }}</span></template
      >
    </h2>
    <p
      v-if="props.sub"
      :class="cn('measure mt-5 text-copy', props.tone === 'dark' ? 'text-white/80' : 'text-body')"
    >
      {{ props.sub }}
    </p>
  </header>
</template>

<script setup lang="ts">
/**
 * Section heading used by every light section (and the dark Commission band). `lead` + `trail`
 * are two consecutive parts of ONE locked sentence — split with `splitCopy()` so the text is
 * never altered.
 */
import type { HTMLAttributes } from "vue";
import { cn } from "~/utils/utils";

const props = withDefaults(
  defineProps<{
    headingId: string;
    label?: string;
    lead: string;
    trail?: string;
    sub?: string;
    align?: "center" | "start";
    tone?: "light" | "dark";
    labelTone?: "neutral" | "terracotta";
    /** Allow a longer measure (two-sentence headings). */
    wide?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  { align: "center", tone: "light", labelTone: "neutral" },
);
</script>
