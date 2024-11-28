<script setup>
import { ClubInfoExtService } from "~/database/clubinfo";

const { t, locale, locales, setLocale, finalizePendingLocaleChange } =
  useI18n();
const { copy } = useClipboard();
const toast = useToast();
const switchLocalePath = useSwitchLocalePath();

const links = computed(() => [
  {
    label: t("nav.barmap"),
    to: locale.value === "ko" ? "/" : `/${locale.value}`,
  },
  // ...(import.meta.dev
  //   ? [
  //       {
  //         label: t("nav.clubInfo"),
  //         to: locale.value === "ko" ? "/clubInfo" : `/${locale.value}/clubInfo`,
  //       },
  //     ]
  //   : []),
]);

const title = useI18n().t("app.title");
const description = useI18n().t("app.description");

// useSeoMeta({
//   title,
//   description,
//   ogTitle: title,
//   ogDescription: description,
//   ogImage: "/social-card.png",
//   twitterImage: "/social-card.png",
//   twitterCard: "summary_large_image",
// });

const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value);
});

useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: computed(() =>
      import.meta.client ? localStorage.getItem("locale") || "ko" : "ko"
    ),
  },
});

// 앱 초기화 시 한 번만 locale 체크
onBeforeMount(async () => {});

const onBeforeEnter = async () => {
  await finalizePendingLocaleChange();
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <UNotifications />
    <NuxtLoadingIndicator />
    <UHeader :links="links">
      <template #logo>
        <ClientOnly>
          <NuxtLink to="/" class="text-lg font-bold"> Social Dance </NuxtLink>
        </ClientOnly>
      </template>

      <template #right>
        <div class="flex items-center gap-2 sm:gap-4">
          <NuxtLink
            v-for="curLocale in availableLocales"
            :key="curLocale.code"
            :to="switchLocalePath(curLocale.code)"
            class="text-xs sm:text-base"
          >
            {{ curLocale.name }}
          </NuxtLink>

          <UColorModeButton />
        </div>
      </template>
    </UHeader>

    <UMain class="flex-grow">
      <NuxtPage
        :transition="{
          name: 'page',
          mode: 'out-in',
          onBeforeEnter,
        }"
      />
    </UMain>

    <UFooter>
      <!-- <template #left>
        {{ $t("app.copyright", { year: new Date().getFullYear() }) }}
      </template> -->
    </UFooter>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s;
}
.page-enter,
.page-leave-active {
  opacity: 0;
}
</style>
