<template>
    <div>
        <a :href="'/video/' + video?.data.asset?.id">
        <h4>Video: {{video?.data.asset.title}}</h4>
        <!-- <img class="image" :src="video?.data.asset?.images?.defaultUrl" /> -->
        </a>
        <div>{{video}}</div>
    </div>
</template>