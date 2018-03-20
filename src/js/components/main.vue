<style lang="scss" type="text/scss">
    .app {
        background-color: #fff;
        min-height: 100vh;
    }
</style>
<template>
    <div class="app">
          <main-header />
          <router-view />
    </div>
</template>
<script>
    import mainHeader from '@/components/layouts/header.vue';


    export default {
        components: { mainHeader },
    }
</script>
