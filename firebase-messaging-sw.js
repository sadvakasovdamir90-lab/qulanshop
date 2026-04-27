// 1. Көне стильдегі импорттарды compat нұсқасына ауыстырамыз
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// 2. Инициализация (Деректерді сақтай отырып)
firebase.initializeApp({
    apiKey: "AIzaSyDyRiRE8tgUF-OANANOYQUzYSfl9vtsjuM",
    projectId: "qulanmedia-96282",
    messagingSenderId: "1085151021799",
    appId: "1:1085151021799:web:4475b38903d829c560b042"
});

// 3. Messaging объектісін алу
const messaging = firebase.messaging();

// 4. Фондық хабарламаларды бақылау (Міндетті түрде керек, әйтпесе Push келмейді)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Фондық хабарлама келді: ', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'images/news.png' // Логотип жолын тексер
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});