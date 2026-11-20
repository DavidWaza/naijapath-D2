<template>
  <!-- Photo panel (d2 auth): full-height photo, dark gradient at the foot, a large two-tone
       statement (approved copy) with the tail in a soft-terracotta serif italic, then a title/caption and
       previous/next arrows. Manual only: no autoplay. -->
  <section
    :aria-label="a.slidesLabel"
    aria-roledescription="carousel"
    data-surface="dark"
    :class="cn('relative isolate overflow-clip rounded-[1.25rem] bg-forest-deep', props.class)"
  >
    <NuxtPicture
      v-for="(slide, i) in AUTH_SLIDES"
      :key="i"
      :src="slide.image.src"
      alt=""
      fit="cover"
      sizes="lg:55vw xl:760px xxl:820px"
      format="avif,webp"
      legacy-format="jpeg"
      :loading="i === 0 ? 'eager' : 'lazy'"
      aria-hidden="true"
      :class="
        cn(
          'absolute inset-0 -z-10 block size-full transition-[opacity,scale] duration-700 ease-out-soft',
          i === active ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0',
        )
      "
      :img-attrs="{
        class: 'size-full object-cover',
        style: `object-position: ${slide.image.position}`,
      }"
    />
    <!-- Scrim: text only ever sits over ≥ 85% forest-deep. -->
    <div
      aria-hidden="true"
      class="absolute inset-0 -z-10 bg-linear-to-t from-forest-deep from-30% via-forest-deep/60 via-55% to-transparent"
    />

    <div class="flex h-full flex-col justify-end p-8 xl:p-12">
      <div
        v-for="(slide, i) in AUTH_SLIDES"
        v-show="i === active"
        :key="i"
        role="group"
        aria-roledescription="slide"
        :aria-label="a.slideOf(i + 1, AUTH_SLIDES.length)"
        class="mp-slide"
      >
        <p
          class="max-w-[22ch] font-heading text-[clamp(1.875rem,1rem+1.9vw,2.75rem)] leading-[1.15] font-semibold tracking-[-0.02em] text-white"
        >
          {{ slide.lead }}
          <span class="font-serif font-normal tracking-normal text-ember-soft italic">{{
            slide.highlight
          }}</span>
        </p>
        <div class="mt-8 flex items-end justify-between gap-6">
          <div>
            <p class="font-heading text-lg font-semibold text-white">{{ slide.title }}</p>
            <p class="mt-1 text-sm text-white/80">{{ slide.caption }}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-between gap-4 border-t border-white/15 pt-5">
        <p class="tabular text-sm text-white/75" aria-hidden="true">
          {{ String(active + 1).padStart(2, "0") }} /
          {{ String(AUTH_SLIDES.length).padStart(2, "0") }}
        </p>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="inline-flex size-11 items-center justify-center rounded-full text-white transition-colors duration-200 ease-out-soft hover:bg-white/10"
            :aria-label="a.prevSlide"
            @click="go(-1)"
          >
            <NIcon name="arrow-left" :size="22" />
          </button>
          <button
            type="button"
            class="inline-flex size-11 items-center justify-center rounded-full text-white transition-colors duration-200 ease-out-soft hover:bg-white/10"
            :aria-label="a.nextSlide"
            @click="go(1)"
          >
            <NIcon name="arrow-right" :size="22" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/** Auth photo panel. Decorative photos (alt=""); the statements are real text. */
import { ref, type HTMLAttributes } from "vue";
import { cn } from "~/utils/utils";
import { AUTH_SLIDES } from "../../domain/auth-slides";
import { PAGES_MICROCOPY } from "../../domain/pages-microcopy";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const a = PAGES_MICROCOPY.auth;
const active = ref(0);
const go = (dir: 1 | -1) => {
  active.value = (active.value + dir + AUTH_SLIDES.length) % AUTH_SLIDES.length;
};
</script>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .mp-slide {
    animation: mp-slide-in 500ms var(--ease-out-soft) both;
  }
}
@keyframes mp-slide-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}
</style>
