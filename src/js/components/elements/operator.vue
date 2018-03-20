<style lang="scss" type="text/scss">
    .operator {
        display: flex;
        flex-direction: column;
        width: 50px;
        margin: 10px;
    }
</style>
<template>
    <div class="operator">
        <select v-if="input" v-model="input" class="">
            <option v-for="(op, index) in operators" :value="op">{{ op.value }}</option>
        </select>
    </div>
</template>
<script>


    export default {
        components: {},

        data() {
            return {
                input: null,
            }
        },

        props: {
            value: {
                type: Object,
                required: true,
            },

            operators: {
                type: Array,
                required: true,
            }
        },

        watch: {
            input() {
                this.$emit('input', this.input);
            },
        },

        mounted() {
            this.input = this.value;
        }

    }
</script>
