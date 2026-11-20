<template>
  <!-- §04 For You (d2): framed photo left with the Agreed Actions record overlapping it; copy
       right. -->
  <section
    :id="HOME_SECTION_IDS.forYou"
    tabindex="-1"
    aria-labelledby="for-you-heading"
    class="pb-[clamp(3rem,0.5rem+8vw,8.5rem)] defer-render"
  >
    <div class="site-container grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-x-12">
      <!-- Photo in a white frame + the session record. -->
      <div class="relative pb-28 sm:pb-20 lg:col-span-6 lg:pb-16">
        <div class="rounded-card border border-hairline bg-sheet p-3">
          <NuxtPicture
            :src="BENEFICIARY_IMAGE"
            :alt="MICROCOPY.images.beneficiary"
            width="640"
            height="640"
            fit="cover"
            sizes="xs:92vw sm:600px lg:46vw xl:560px"
            format="avif,webp"
            legacy-format="jpeg"
            loading="lazy"
            :img-attrs="{
              class: 'aspect-square w-full rounded-[0.75rem] object-cover object-[35%_center]',
              decoding: 'async',
            }"
          />
        </div>
        <div
          ref="cardWrap"
          class="reveal absolute right-3 bottom-0 left-3 sm:right-auto sm:left-auto sm:-right-0 lg:-right-8"
          :data-revealed="cardVisible"
        >
          <MhHomeAgreedActionsCard class="ml-auto" />
        </div>
      </div>

      <!-- Copy -->
      <div class="lg:col-span-6 xl:col-span-5 xl:col-start-8">
        <MhHomeSectionHead
          heading-id="for-you-heading"
          :label="copy.label"
          label-tone="terracotta"
          :lead="HEADLINE[0]"
          :trail="HEADLINE[1]"
          align="start"
        />
        <div class="measure mt-6 flex flex-col gap-4 text-copy text-body">
          <p v-for="para in copy.body" :key="para">{{ para }}</p>
        </div>
        <div class="mt-8">
          <NButton :to="copy.cta.to" color="primary" size="lg" class="w-full xs:w-auto">
            {{ copy.cta.label }}
            <NIcon name="arrow-right" :size="18" />
          </NButton>
          <p class="mt-3 text-sm text-muted italic">{{ copy.supportingNote }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/** §04 For You (d2). */
import { ref } from "vue";
import { BENEFICIARIES_COPY } from "../../domain/home-copy";
import { HOME_SECTION_IDS } from "../../domain/home-routes";
import { MICROCOPY } from "../../domain/home-microcopy";
import { splitCopy } from "../../domain/split-copy";

const copy = BENEFICIARIES_COPY;
const HEADLINE = splitCopy(copy.headline, "who documents your progress.");
// CLIENT PHOTO SLOT — replace with the client's own shoot at the same path.
const BENEFICIARY_IMAGE = "/images/beneficiary-session.jpg";

const cardWrap = ref<HTMLElement | null>(null);
const cardVisible = useInViewOnce(cardWrap, { threshold: 0.3 });
</script>
