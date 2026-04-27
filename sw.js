const CACHE_NAME = 'qulanshop-v1';
const assets = [
  'index.html',
  'profile.html',
  'admin.html',
  'manifest.json',
  'script.js' // Негізгі скриптті де кэшке қосқан дұрыс
];

// 1. ОРНАТУ ЖӘНЕ ФАЙЛДАРДЫ КЭШКЕ САҚТАУ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Кэш ашылды, файлдар жүктелуде...');
      return cache.addAll(assets);
    })
  );
});

// 2. ИНТЕРНЕТСІЗ ЖҰМЫС ІСТЕУ ЖӘНЕ FETCH СҰРАНЫСТАРЫН БАСҚАРУ
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Егер кэште болса соны береді, болмаса интернеттен алады
      // Ескерту: Firebase немесе сыртқы API сұраныстарын кэштемеген дұрыс
      if (event.request.url.includes('firebase') || event.request.url.includes('google')) {
          return fetch(event.request);
      }
      return response || fetch(event.request);
    }).catch(() => {
        // Егер интернет те, кэш те істемесе - басты бетті ашуға болады
        return caches.match('index.html');
    })
  );
});

// 3. FIREBASE MESSAGING БӨЛІМІ (PUSH-NOTIFICATIONS)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDyRiRE8tgUF-OANANOYQUzYSfl9vtsjuM",
    authDomain: "qulanmedia-96282.firebaseapp.com",
    projectId: "qulanmedia-96282",
    messagingSenderId: "1085151021799",
    appId: "1:1085151021799:web:4475b38903d829c560b042"
};

// Firebase-ті іске қосу
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Фондық режимде хабарламаларды қабылдау
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Фондық режимде хабарлама келді: ', payload);

    // 1. Хабарлама деректерін алу
    const title = payload.notification.title || "QulanMedia Хабарлама";
    const body = payload.notification.body || "";
    
    // 2. Хабарлама параметрлерін баптау (iPhone/Android экраны үшін)
    const notificationOptions = {
        body: body,
        icon: 'images/news.png', // Портал логотипі
        badge: 'images/news.png', // Телефонның жоғарғы жағындағы кішкентай белгі
        
        // Жоғалған заттың немесе жаңалықтың суретін шығару
        image: payload.data && payload.data.image ? payload.data.image : null, 
        
        // Діріл (Маңызды хабарлар үшін: діріл - үзіліс - діріл)
        vibrate: [200, 100, 200],
        
        // Хабарламаларды топтастыру (экран толып кетпеуі үшін)
        tag: 'qulan-news-alert',
        renotify: true,

        // Қосымша деректер (басқанда қайда баратыны)
        data: {
            url: payload.data && payload.data.url ? payload.data.url : '/news.html'
        },
        
        // Хабарлама ішіндегі батырмалар (Тікелей экраннан "Көру" батырмасы)
        actions: [
            { action: 'open_url', title: 'ОҚУ 📖' },
            { action: 'close', title: 'ЖАБУ ❌' }
        ]
    };

    return self.registration.showNotification(title, notificationOptions);
});

// 3. Хабарламаны басқан кезде сайтты ашу логикасы
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Хабарламаны жабу

    // Егер "Оқу" басылса немесе хабарламаның өзі басылса
    if (event.action !== 'close') {
        const urlToOpen = event.notification.data.url;

        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
                // Егер сайт ашық тұрса, соған фокус жасау
                for (let client of windowClients) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Егер жабық болса, жаңа терезеде ашу
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
        );
    }
});

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://i.yapx.ru/ddHXU.png',
        data: { url: payload.data ? payload.data.url : '/news.html' }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});