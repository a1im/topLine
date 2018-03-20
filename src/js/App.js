import 'babel-polyfill';
import Vue from 'vue';
import router from '@/router';
import mainComponent from '@/components/main.vue';

export const UserApp = new Vue({
    el: "#app",
    components: { mainComponent },
    template: '<main-component />',
    router,
});
