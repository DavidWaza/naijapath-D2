<template>
  <!-- §03 Intro + numbers (d2): centred pill label and two-tone title (the hero subheadline,
       first sentence ink, second muted), then four stat cards. -->
  <section :id="HOME_SECTION_IDS.trust" aria-labelledby="intro-heading" class="section-y">
    <div class="site-container">
      <MhHomeSectionHead
        heading-id="intro-heading"
        :label="MICROCOPY.a11y.trustBarHeading"
        :lead="TITLE[0]"
        :trail="TITLE[1]"
        wide
      />

      <ul class="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-4">
        <MhHomeTrustStat v-for="stat in TRUST_STATS" :key="stat.label" :stat="stat" />
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * §03 Intro + numbers. The four approved trust figures; 350+ and 45+ count up once on view.
 * (The rating badge lives on the hero card.)
 */
import { HERO_COPY, TRUST_STATS } from "../../domain/home-copy";
import { HOME_SECTION_IDS } from "../../domain/home-routes";
import { MICROCOPY } from "../../domain/home-microcopy";
import { splitCopy } from "../../domain/split-copy";

const TITLE = splitCopy(HERO_COPY.subheadline, "Career guidance that");
</script>
