<template>
  <div>
    <NuxtLink to="/"><h1>Kayo Sports</h1></NuxtLink>
    <slot></slot>
  </div>
</template>
<script setup>
// window.HELP_IMPROVE_VIDEOJS = false;
useHead({
  title: "Kayo Sports",
  script: [
    {
      hid: "videojs",
      src: "//vjs.zencdn.net/7.18.1/video.min.js",
      defer: true,
    },
  ],
  link: [
    {
      href: "//vjs.zencdn.net/7.10.2/video-js.min.css",
      rel: "stylesheet",
    },
  ],
});
</script>
<style>
video {
  max-width: 100%;
}
#main {
  max-width: 840px;
  margin-right: auto;
  margin-left: auto;
}
</style>