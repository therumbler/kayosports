<script setup>
console.log("Home component");
const usePanels = () => useState("panels");
let panels = usePanels();

let url =
  "https://vccapi.kayosports.com.au/v2/content/types/landing/names/home?evaluate=3";
let headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36",
};
console.log("fetching", url);
const resp = await fetch(url, { headers: headers });

let panelsObj = await resp.json();
console.log("panelsObj", panelsObj);
panels.value = panelsObj;
// let resp = await fetch(url, {
//   headers: headers,
// });
// let respPanels = await resp.json();
// console.log("respPanels", respPanels);
// panels.value = respPanels;

// await init();
</script>
<template>
  <div>
    <h2>Home</h2>
    <div v-for="panel in panels" :key="panel?.id">
      <h4>{{ panel?.title }}</h4>
      <div v-for="content in panel.contents" :key="content.id">
        <a :href="'/video/' + content?.data.asset?.id">
        <div>{{ content.data.asset.title }}</div>
        <img class="image" :src="content?.data.asset?.images?.defaultUrl" />
        </a>
      </div>

      <!-- <Video v-for="video in panel.contents" :key="video.id" video="video" /> -->
    </div>
    <!-- <div>{{panels}}</div> -->
  </div>
</template>
