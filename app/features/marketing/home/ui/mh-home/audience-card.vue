<template>
  <article
    :data-surface="dark ? 'dark' : undefined"
    :class="
      cn(
        'group/card relative flex flex-col rounded-card border p-6 sm:p-7',
        THEME[props.card.theme].card,
        props.class,
      )
    "
  >
    <span
      aria-hidden="true"
      :class="
        cn(
          'inline-flex size-11 items-center justify-center rounded-sm',
          THEME[props.card.theme].tile,
        )
      "
    >
      <NIcon :name="props.card.icon" :size="22" />
    </span>

    <p :class="cn('mt-10 font-heading text-sm font-semibold', THEME[props.card.theme].eyebrow)">
      {{ props.card.audience }}
    </p>
    <h3 :class="cn('mt-2 text-subtitle font-semibold', dark ? 'text-white' : 'text-ink')">
      {{ props.card.headline }}
    </h3>
    <p :class="cn('mt-4 text-copy', dark ? 'text-white/85' : 'text-body')">
      {{ props.card.body }}
    </p>

    <!-- Stretched link: the whole card is the hit area; the visible text is the accessible name. -->
    <NTextLink
      :to="props.card.cta.to"
      :class="
        cn(
          'mt-8 after:absolute after:inset-0 after:rounded-card after:content-[\'\']',
          THEME[props.card.theme].link,
        )
      "
    >
      {{ props.card.cta.label }}
    </NTextLink>
  </article>
</template>

<script setup lang="ts">
/** One "front door" (brief §08): mint, terracotta tint, or dark green with white text. */
import { computed, type HTMLAttributes } from "vue";
import { cn } from "~/utils/utils";
import type { AudienceCard, AudienceTheme } from "../../domain/home-copy";

const props = defineProps<{ card: AudienceCard; class?: HTMLAttributes["class"] }>();
const dark = computed(() => props.card.theme === "dark");

const THEME: Record<AudienceTheme, { card: string; tile: string; eyebrow: string; link: string }> =
  {
    mint: {
      card: "border-mint bg-mint-50",
      tile: "bg-mint text-forest-deep",
      eyebrow: "text-forest",
      link: "text-forest hover:text-forest-deep",
    },
    terracotta: {
      card: "border-[#f3d9ce] bg-sand",
      tile: "bg-[#f3d9ce] text-ember-deep",
      eyebrow: "text-ember",
      link: "text-ember hover:text-ember-deep",
    },
    dark: {
      card: "border-forest-deep bg-forest-deep",
      tile: "bg-mint text-forest-deep",
      eyebrow: "text-moss",
      link: "text-white hover:text-mint",
    },
  };
</script>
