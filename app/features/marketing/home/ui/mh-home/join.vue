<template>
  <!-- §08 Join the Platform (d2): centred head, three "front doors" — mint, terracotta tint,
       dark green — each an icon tile, audience, headline, body and a text-link CTA. -->
  <section
    :id="HOME_SECTION_IDS.join"
    tabindex="-1"
    aria-labelledby="join-heading"
    class="section-y defer-render"
  >
    <div class="site-container">
      <MhHomeSectionHead heading-id="join-heading" :label="copy.label" :lead="copy.headline" />

      <ul class="mt-12 grid grid-cols-1 items-start gap-3 md:grid-cols-3 lg:mt-16 lg:gap-4">
        <li v-for="card in copy.cards" :key="card.audience">
          <MhHomeAudienceCard :card="card" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
/** §08 Join the Platform (d2). Cards share a width, not a forced height (brief §08). */
import { JOIN_COPY } from "../../domain/home-copy";
import { HOME_SECTION_IDS } from "../../domain/home-routes";

const copy = JOIN_COPY;
</script>
