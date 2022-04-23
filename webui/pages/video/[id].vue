<template>
  <div>
    Video asset id: {{ $route.params.id }}
    <h2>{{ asset?.data?.data[0]?.assetTitle }}</h2>
    <video
      controls
      id="kayo-video"
      class="video-js"
      preload="none"
      data-setup='{"fluid": true}'
    >
      <!-- <source
        v-for="stream in asset?.data.data[0]?.alternativeStreams"
        :key="stream.id"
        :src="stream.manifest.uri"
        type="application/x-mpegURL"
      /> -->
      <source :src="streamUrl" type="application/x-mpegURL" />
    </video>
    <div>{{ asset }}</div>
  </div>
</template>
<script setup>
function getStreamUrl(videoObj) {
  console.log("getStreamUrl");
  console.log("videoObj", JSON.stringify(videoObj));
  if (!videoObj.data) {
    return videoObj;
  }
  console.log("filtering streams...");
  let streamUrl;
  Array.prototype.forEach.call(
    videoObj.data._rawValue.data[0].alternativeStreams,
    function (stream, i) {
      // if(stream.manifest.uri.indexOf("foxtel") > -1) {
      //   streamUrl = stream.manifest.uri.replace('https://foxtel-761f422bb93edb7b.secure.footprint.net/', 'https://au01.irumble.com/');
      // }
      if (
        stream.manifest.uri.indexOf("6b5b12aff40545729767280b02317b5f") > -1
      ) {
        streamUrl = stream.manifest.uri.replace(
          "https://6b5b12aff40545729767280b02317b5f.mediatailor.ap-southeast-2.amazonaws.com/",
          "https://au01.irumble.com/"
        );
      }
    }
  );
  let manifestUri = videoObj.data._rawValue.data[0].recommendedStream.manifest.uri;
  if (
    manifestUri.indexOf(
      "6b5b12aff40545729767280b02317b5f"
    ) > -1
  ) {
    streamUrl = manifestUri.replace(
      "https://6b5b12aff40545729767280b02317b5f.mediatailor.ap-southeast-2.amazonaws.com/",
      "https://au01.irumble.com/"
    );
  }
  console.log("streamUrl", streamUrl);
  return streamUrl;
}
const route = useRoute();
const useAsset = () => useState("asset");
const useStreamUrl = () => useState("streamUrl");
let asset = useAsset();
let streamUrl = useStreamUrl();
// streamUrl.value = "https://au01.irumble.com";
// let asset = { data: [] };
const url = `/api/video/${route.params.id}`;
console.log("url", url);
let videoObj = await useFetch(url);
asset.value = videoObj;
streamUrl.value = getStreamUrl(videoObj);
// console.log("asset", asset.value);
// const validStreams = resp.data.alternativeStreams.filter(
//   (stream) => stream.manifest.uri.indexOf("foxtel") > -1
// );
// // const videoObj = await resp.json();
// src.value = validStreams[0].manifest.uri;
// asset.value = resp;
// videojs("kayo-video", { fluid: true });
</script>