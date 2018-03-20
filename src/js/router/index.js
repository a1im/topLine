import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);


import calcPage from '@/components/pages/calc.vue'
import websocketPage from '@/components/pages/websocket.vue'


const router = new Router({
    routes: [
        {
            path: '/',
            name: 'calc',
            component: calcPage,
        },

        {
            path: '/websocket',
            name: 'websocket',
            component: websocketPage,
        },

        // {
        //     path: '*',
        //     props: { navMenu: true },
        //     component: errorPage,
        // }
    ],
});

export default router;
