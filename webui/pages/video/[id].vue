<template>
  <div>
    <h2>{{ asset?.data?.data[0]?.assetTitle }}</h2>
    <div v-for="stream in streams" :key="stream.id">
      <video
        controls
        :id="stream.id"
        class="video-js"
        preload="none"
        data-setup='{"fluid": true}'
      >
        <source :src="stream.manifest.uri" type="application/x-mpegURL" />
        <!-- <source :src="streamUrl" type="application/x-mpegURL" /> -->
      </video>
      <a :href="stream.manifest.uri">direct stream link</a>
    </div>
    <!-- <div><a :href="streamUrl">direct stream url</a></div> -->
    <div>{{ asset }}</div>
  </div>
</template>
<script setup>
function updateStreamUriWithHostName(uri, replacement) {
  return uri.replace(`https://${replacement}/`, `/${replacement}/`);
}

function updateStreamUriWithoutHostName(uri, replacement) {
  return uri.replace(`https://${replacement}/`, "/");
}
function getStreams(videoObj) {
  let replacements = [
    // "https://6b5b12aff40545729767280b02317b5f.mediatailor.ap-southeast-2.amazonaws.com/",
    "foxtel-761f422bb93edb7b.secure.footprint.net",
    "foxtel-814bffb9b389f652.secure.footprint.net",
    "1974f6e75add4217a610e2dec4f270c0.mediatailor.ap-southeast-2.amazonaws.com",
    "strm-akm-vod-af41c008d1b0c2c950ea78ebafec7077.akamaized.net",
    "6b5b12aff40545729767280b02317b5f.mediatailor.ap-southeast-2.amazonaws.com"
    // "https://1974f6e75add4217a610e2dec4f270c0.mediatailor.ap-southeast-2.amazonaws.com/",
  ]; 
  //replacements = [];
  if (videoObj.data.hasOwnProperty("_rawValue")) {
    videoObj = videoObj.data._rawValue;
  }
  
  let data = videoObj.data[0];
  let allStreams = [];

  Array.prototype.forEach.call(data.alternativeStreams, function (stream, i) {
    Array.prototype.forEach.call(replacements, function (replacement, i) {
      if (stream.manifest.uri.indexOf(replacement) > -1) {
        console.log(`Got replacement match for ${replacement}`);
        let newStream = stream;
        newStream.manifest.uri = updateStreamUriWithoutHostName(
          stream.manifest.uri,
          replacement
        );

        newStream.id = `0-replaced-${newStream.id}`;
        // console.log("pushing into ", allStreams);
        console.log("newStream.manifest.uri:", newStream.manifest.uri);
        allStreams.push(newStream);
      } else {
        // console.log("no replace for", stream.manifest.uri);
      }
    });
  });

  Array.prototype.forEach.call(data.alternativeStreams, function (stream, i) {
    allStreams.push(stream);
  });

  allStreams.push(data.recommendedStream);
  // console.log("allStreams", allStreams);
  return allStreams;
}
const route = useRoute();
const useAsset = () => useState("asset");
const useStreams = () => useState("streams");
let asset = useAsset();
let streams = useStreams();

const url = `/api/video/${route.params.id}`;
let videoObj = await useFetch(url);
asset.value = videoObj;

// console.log("asset", asset.value);
streams.value = getStreams(videoObj);
</script>

