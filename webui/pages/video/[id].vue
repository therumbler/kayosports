<template>
  <div>
    Video asset id: {{ $route.params.id }}
    <h2>{{ asset?.data?.data[0]?.assetTitle }}</h2>
    <video
      controls
      id="kayo-video"
      class="video-js"
      data-setup='{"fluid": true}'
    >
      <source
        v-for="stream in asset?.data.data[0]?.alternativeStreams"
        :key="stream.id"
        :src="stream.manifest.uri"
      />
    </video>
    <div>{{ asset }}></div>
  </div>
</template>
<script setup>
// import videojs from "video.js";
const route = useRoute();
const useAsset = () => useState("asset");
let asset = useAsset();
// let asset = { data: [] };
const url = `/api/video/${route.params.id}`;
console.log("url", url);
asset.value = await useFetch(url);

console.log("asset", asset.value);
// const validStreams = resp.data.alternativeStreams.filter(
//   (stream) => stream.manifest.uri.indexOf("foxtel") > -1
// );
// // const videoObj = await resp.json();
// src.value = validStreams[0].manifest.uri;
// asset.value = resp;
// videojs("kayo-video", { fluid: true });
</script>