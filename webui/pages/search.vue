<template>
  <div>
    <h1>Search Kayo</h1>

    <form class="form" @submit.prevent="performSearch">
      <input type="text" v-model="term" placeholder="Search" />
      <input type="submit" value="Search" />
    </form>

    <div>
      <div v-for="result in results" :key="result.data.asset?.id">
        <a :href="'/video/' + result.data.asset?.id">
          <div>{{ result.data.asset?.title }}</div>
          <img class="image" :src="result.data.asset?.images?.defaultUrl" />
        </a>
      </div>
    </div>
    <div>{{ results }}</div>
  </div>
</template>
<style scoped>
.image {
  max-width: 100%;
}
</style>
<script setup>
const useResults = () => useState("results");
const useTerm = () => useState("term");
const results = useResults();
const term = useTerm();

async function performSearch() {
  console.log("performSearch");
  let url = `https://vccapi.kayosports.com.au/v2/search?size=25&q=${term.value}`;
  const resp = await fetch(url);
  const respResults = await resp.json();
  console.log("respResults", respResults.results);
  results.value = respResults.results;
}
</script>
