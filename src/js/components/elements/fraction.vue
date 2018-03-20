<style lang="scss" type="text/scss">
    .fraction {
        display: flex;
        flex-direction: column;
        width: 70px;
        margin: 10px;
    }
</style>
<template>
    <div class="fraction">
        <input v-model="input[0]" type="text" :disabled="disabled">
        <hr width=100%>
        <input v-model="input[1]" type="text" :disabled="disabled">
    </div>
</template>
<script>


    export default {
        components: {},

        data() {
            return {
                input: ['', ''],
            }
        },

        props: {
            value: {
                type: Array,
                required: true,
            },

            disabled: {
                type: Boolean,
                default: false,
            }
        },

        watch: {
            input() {
                this.$emit('input', this.input);
            },

            value() {
                this.input = this.value;
            },
        },

        mounted() {
            this.input = this.value;
        }

    }
</script>
