mportScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js",
);
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts(
    "https://www.gstatic.com/firebasejs/7.16.1/firebase-analytics.js",
);

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyCuqhSq393tr6QMZdpJKu9_BcYrfbsed3o",
    authDomain: "mycarpro-e91d1.firebaseapp.com",
    projectId: "mycarpro-e91d1",
    storageBucket: "mycarpro-e91d1.appspot.com",
    messagingSenderId: "204195380911",
    appId: "1:204195380911:web:f50b325f9733660abc1e5a",
    measurementId: "G-1SXKVQEQWG"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload,
    );
    // Customize notification here
    const notificationTitle = "Background Message Title";
    const notificationOptions = {
        body: "Background Message body.",
        icon: "/itwonders-web-logo.png",
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
    );
});


//     // отправка ID на сервер
//     function sendTokenToServer(currentToken) {
//     if (!isTokenSentToServer(currentToken)) {
//     console.log('Отправка токена на сервер...');
//
//     var url = 'notification-token'; // адрес скрипта на сервере который сохраняет ID устройства
//     $.ajaxSetup({
//     headers:{
//     'Authorization': "1c68140c1a43af4bbea83860cc33ca80"
// }
// });
//     $.post(url, {
//     token: currentToken
// });
//
//     setTokenSentToServer(currentToken);
// } else {
//     console.log('Токен уже отправлен на сервер.');
// }
// }