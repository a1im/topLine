<style lang="scss" type="text/scss">
    .websocket {

        &__comment {
            font-size: 20px;
        }

        &__del {
            font-size: .7em;
            opacity: .7;
            cursor: pointer;
        }
    }
</style>
<template>
    <div class="websocket">
        <h1>Взаимодействие с сервером по протоколу websocket</h1>
        <ul class="websocket__wrapper">
            <li class="websocket__comment" v-for="(comment, index) in comments" :key="index">
                {{comment.text}}
                <span class="websocket__del" @click="delComment(comment)">удалить</span>
            </li>
        </ul>
    </div>
</template>
<script>
    import ws from '@/utils/websocket'


    export default {
        components: {},

        data() {
            return {
                comments: [
                    {text: 'Тестовый коммент 1'},
                    {text: 'Это шедевр'},
                    {text: 'Это прекрасно'},
                    {text: 'Лучшее, что я видел'},
                    {text: 'Два чая этому автору'},
                    {text: 'Test 1'},
                    {text: 'Test 2'},
                    {text: 'Test 3'},
                    {text: 'Test 4'},
                    {text: 'Test 5'},
                ]
            }
        },

        watch: {},

        methods: {
            delComment(comment) {
                ws.socketRequest({command: 'delComment', text: comment.text}).then(() => {
                    console.log('Комментарий удален ' + comment.text);
                    this.comments = this.comments.filter(el => el !== comment);
                }).catch(() => {
                    console.log('Ошибка удаления комментария - ' + comment.text)
                });
            },

        },

        created() {
            ws.setTimeout(333);
            ws.open('ws://echo.websocket.org/');
        },

        beforeDestroy() {
            ws.close();
        },

    }
</script>
