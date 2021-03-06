// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.


// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyCuqhSq393tr6QMZdpJKu9_BcYrfbsed3o",
    projectId: "mycarpro-e91d1",
    messagingSenderId: "204195380911",
    appId: "1:204195380911:web:f50b325f9733660abc1e5a"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// messaging.onMessage((payload) => {
//     console.log('Message received. ', payload);
//     // ...
// });


// браузер поддерживает уведомления
// вообще, эту проверку должна делать библиотека Firebase, но она этого не делает
if ('Notification' in window) {
    console.log("here");
    // пользователь уже разрешил получение уведомлений
    // подписываем на уведомления если ещё не подписали
    if (Notification.permission === 'granted') {
        subscribe();
    }

    // по клику, запрашиваем у пользователя разрешение на уведомления
    // и подписываем его
    $('#subscribe').on('click', function () {
        console.log("here2");
        subscribe();
    });

    messaging.onMessage(function(payload) {
        console.log('Message received. ', payload);

        // регистрируем пустой ServiceWorker каждый раз
        navigator.serviceWorker.register('messaging-sw.js');

        // запрашиваем права на показ уведомлений если еще не получили их
        Notification.requestPermission(function(result) {
            if (result === 'granted') {
                navigator.serviceWorker.ready.then(function(registration) {
                    // теперь мы можем показать уведомление
                    return registration.showNotification(payload.notification.title, payload.notification);
                }).catch(function(error) {
                    console.log('ServiceWorker registration failed', error);
                });
            }
        });
    });
}

function subscribe() {
    // запрашиваем разрешение на получение уведомлений
    messaging.requestPermission()
        .then(function () {
            // получаем ID устройства
            messaging.getToken()
                .then(function (currentToken) {
                    console.log(currentToken);

                    if (currentToken) {
                        sendTokenToServer(currentToken);
                    } else {
                        console.warn('Не удалось получить токен.');
                        setTokenSentToServer(false);
                    }
                })
                .catch(function (err) {
                    console.warn('При получении токена произошла ошибка.', err);
                    setTokenSentToServer(false);
                });
        })
        .catch(function (err) {
            console.warn('Не удалось получить разрешение на показ уведомлений.', err);
        });
}

// отправка ID на сервер
function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
        console.log('Отправка токена на сервер...');

        var url = 'notification-token'; // адрес скрипта на сервере который сохраняет ID устройства
        $.ajaxSetup({
            headers:{
                'Authorization': "1c68140c1a43af4bbea83860cc33ca80"
            }
        });
        $.post(url, {
            token: currentToken
        });

        setTokenSentToServer(currentToken);
    } else {
        console.log('Токен уже отправлен на сервер.');
    }
}

// используем localStorage для отметки того,
// что пользователь уже подписался на уведомления
function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer(currentToken) {
    window.localStorage.setItem(
        'sentFirebaseMessagingToken',
        currentToken ? currentToken : ''
    );
}


//
//
// //     // отправка ID на сервер
// //     function sendTokenToServer(currentToken) {
// //     if (!isTokenSentToServer(currentToken)) {
// //     console.log('Отправка токена на сервер...');
// //
// //     var url = 'notification-token'; // адрес скрипта на сервере который сохраняет ID устройства
// //     $.ajaxSetup({
// //     headers:{
// //     'Authorization': "1c68140c1a43af4bbea83860cc33ca80"
// // }
// // });
// //     $.post(url, {
// //     token: currentToken
// // });
// //
// //     setTokenSentToServer(currentToken);
// // } else {
// //     console.log('Токен уже отправлен на сервер.');
// // }
// // }