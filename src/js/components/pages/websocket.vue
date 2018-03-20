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

    const SOCKET_TIMEOUT = 333;

    export default {
        components: {},

        data() {
            return {
                socket: new WebSocket('ws://echo.websocket.org/'),
                isOpen: false,
                numRequest: 1,
                numResponse: [],
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
            cl(msg) {
                console.log('socket', msg);
            },

            delComment(comment) {
                this.socketRequest(this.numRequest++).then(() => {
                    this.cl('Комментарий удален ' + comment.text);
                    this.comments = this.comments.filter(el => el !== comment);
                }).catch(() => {
                    this.cl('Ошибка удаления комментария - ' + comment.text)
                });
            },

            socketRequest(num) {
                return new Promise((resolve, reject) => {
                    if (this.isOpen) {
                        this.socket.send(num);
                        setTimeout(() => {
                            if (this.numResponse.some(el => el === num)) resolve();
                            else reject();
                            this.numResponse = this.numResponse.filter(el => el !== num)
                        }, SOCKET_TIMEOUT);
                    } else reject();
                })
            },
        },

        created() {
            this.socket.onopen = () => {
                this.isOpen = true;
            };

            this.socket.onclose = (event) => {
                this.isOpen = false;
                if (event.wasClean) {
                    this.cl('Соединение закрыто чисто');
                } else {
                    this.cl('Обрыв соединения');
                }
                this.cl('Код: ' + event.code + ' причина: ' + event.reason);
            };

            this.socket.onmessage = (event) => {
                this.numResponse.push((parseInt(event.data) || -1));
                this.cl("Получены данные: " + event.data);
            };

            this.socket.onerror = (error) => {
                this.cl("Ошибка " + error.message);
            };
        },

    }
</script>
