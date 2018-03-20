<style lang="scss" type="text/scss">
    .header {

        &__list {
            display: flex;
            list-style: none;
        }

        &__link {
            margin-right: 20px;
            font-size: 30px;
            color: blue;
            text-decoration: none;

            &.router-link-exact-active {
                text-decoration: underline;
            }
        }
    }
</style>
<template>
    <header id="header" class="header">
        <nav>
            <ul class="header__list">
                <li>
                    <router-link :to="{ name: 'calc' }" class="header__link">Калькулятор</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'websocket' }" class="header__link">Websocket</router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>
<script>

    export default {
        components: {},

        computed: {}
    }
</script>
