
    MsgElem = document.getElementById("msg");
    TokenElem = document.getElementById("token");
    NotisElem = document.getElementById("notis");
    ErrElem = document.getElementById("err");

    // Initialize Firebase
    // TODO: Replace with your project's customized code snippet
    var config = {
    apiKey: "AIzaSyCuqhSq393tr6QMZdpJKu9_BcYrfbsed3o",
    authDomain: "mycarpro-e91d1.firebaseapp.com",
    projectId: "mycarpro-e91d1",
    storageBucket: "mycarpro-e91d1.appspot.com",
    messagingSenderId: "204195380911",
    appId: "1:204195380911:web:f50b325f9733660abc1e5a",
    measurementId: "G-1SXKVQEQWG"
};
    firebase.initializeApp(config);

    const messaging = firebase.messaging();
    messaging
    .requestPermission()
    .then(function () {
    MsgElem.innerHTML = "Notification permission granted."
    console.log("Notification permission granted.");

    // get the token in the form of promise
    return messaging.getToken()
})
    .then(function(token) {
    TokenElem.innerHTML = "token is : " + token
    sendTokenToServer(currentToken);
})
    .catch(function (err) {
    ErrElem.innerHTML =  ErrElem.innerHTML + "; " + err
    console.log("Unable to get permission to notify.", err);
});

    let enableForegroundNotification = true;
    messaging.onMessage(function(payload) {
    console.log("Message received. ", payload);
    NotisElem.innerHTML = NotisElem.innerHTML + JSON.stringify(payload);

    if(enableForegroundNotification) {
    const {title, ...options} = JSON.parse(payload.data.notification);
    navigator.serviceWorker.getRegistrations().then(registration => {
    registration[0].showNotification(title, options);
});
}
});

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