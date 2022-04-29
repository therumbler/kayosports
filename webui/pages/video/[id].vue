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
      <source
        v-for="stream in streams"
        :key="stream.id"
        :src="stream.manifest.uri"
        type="application/x-mpegURL"
      />
      <!-- <source :src="streamUrl" type="application/x-mpegURL" /> -->
    </video>
    <!-- <div><a :href="streamUrl">direct stream url</a></div> -->
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
      if (stream.manifest.uri.indexOf("foxtel") > -1) {
        streamUrl = stream.manifest.uri.replace(
          "https://foxtel-761f422bb93edb7b.secure.footprint.net/",
          "/"
        );
      }
      if (
        stream.manifest.uri.indexOf("6b5b12aff40545729767280b02317b5f") > -1
      ) {
        streamUrl = stream.manifest.uri.replace(
          "https://6b5b12aff40545729767280b02317b5f.mediatailor.ap-southeast-2.amazonaws.com/",
          "/"
        );
      }
    }
  );

  let manifestUri =
    videoObj.data._rawValue.data[0].recommendedStream.manifest.uri;
  if (manifestUri.indexOf("6b5b12aff40545729767280b02317b5f") > -1) {
    streamUrl = manifestUri.replace(
      "https://6b5b12aff40545729767280b02317b5f.mediatailor.ap-southeast-2.amazonaws.com/",
      "/"
    );
  }

  console.log("streamUrl", streamUrl);
  return streamUrl;
}

function getStreams(videoObj) {
  let replacements = [
    "https://6b5b12aff40545729767280b02317b5f.mediatailor.ap-southeast-2.amazonaws.com/",
    "https://foxtel-761f422bb93edb7b.secure.footprint.net/",
    "https://foxtel-814bffb9b389f652.secure.footprint.net/",
  ];
  if (videoObj.data.hasOwnProperty("_rawValue")) {
    videoObj = videoObj.data._rawValue;
  }
  let data = videoObj.data[0];
  let allStreams = [];

  Array.prototype.forEach.call(data.alternativeStreams, function (stream, i) {
    Array.prototype.forEach.call(replacements, function (replacement, i) {
      if (stream.manifest.uri.indexOf(replacement) > -1) {
        let newStream = stream;
        newStream.manifest.uri = stream.manifest.uri.replace(
          replacement,
          "/"
        );
        newStream.id = `0-replaced-${newStream.id}`;
        console.log('pushing into ', streams);
        allStreams.push(stream);
      }
    });
  });

  Array.prototype.forEach.call(data.alternativeStreams, function (stream, i) {
    allStreams.push(stream);
  });

  allStreams.push(data.recommendedStream);
  console.log("allStreams", allStreams);
  return allStreams;
}
const route = useRoute();
const useAsset = () => useState("asset");
const useStreams = () => useState("streams");
let asset = useAsset();
let streams = useStreams();
// streamUrl.value = "https://au01.irumble.com";
// let asset = { data: [] };
const url = `/api/video/${route.params.id}`;
console.log("url", url);
let videoObj = await useFetch(url);
asset.value = videoObj;

// console.log("asset", asset.value);
streams.value = getStreams(videoObj);
// const validStreams = resp.data.alternativeStreams.filter(
//   (stream) => stream.manifest.uri.indexOf("foxtel") > -1
// );
// // const videoObj = await resp.json();
// src.value = validStreams[0].manifest.uri;
// asset.value = resp;
// videojs("kayo-video", { fluid: true });
</script>