let _timeout = 400;
let _numRequest = 1;
let _websocket = null;
let _numResponses = [];

export default {

    open(url) {
        this.close();
        
        _websocket = new WebSocket(url);
        
        _websocket.onopen = () => {
            console.log('Соединение установлено');
        };

        _websocket.onclose = (event) => {
            if (event.wasClean) {
                console.log('Соединение закрыто чисто');
            } else {
                console.log('Обрыв соединения');
            }
            console.log('Код: ' + event.code + ' причина: ' + event.reason);
            _numResponses = [];
        };

        _websocket.onmessage = (event) => {
            let body = JSON.parse(event.data);
            if (body.num) _numResponses.push(parseInt(body.num));
            console.log("Получены данные: " + event.data);
        };

        _websocket.onerror = (error) => {
            console.log("Ошибка: " + error.message);
        };
    },

    close() {
        if (_websocket) _websocket.close();
    },

    socketRequest(data = {}) {
        let num = _numRequest++;
        let body = {
            num: num,
            data: data,
        };
        return new Promise((resolve, reject) => {
            if (_websocket.readyState === _websocket.OPEN) {
                _websocket.send(JSON.stringify(body));
                setTimeout(() => {
                    if (_numResponses.some(el => el === num)) resolve();
                    else reject();
                    _numResponses = _numResponses.filter(el => el !== num)
                }, _timeout);
            } else reject();
        })
    },

    setTimeout(timeout) {
        _timeout = timeout;
    },
}