// Админ панеліндегі <script> бөліміне қосыңыз:

function checkIncomingMessages() {
    const trigger = localStorage.getItem('new_chat_request');
    
    if (trigger === 'true') {
        const data = JSON.parse(localStorage.getItem('qulan_new_chat'));
        
        // 1. Дыбыстық уведомление (телефондағыдай)
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
        audio.play();

        // 2. Интерфейсті "тірілту"
        document.getElementById('empty-list-msg').style.display = 'none';
        document.getElementById('placeholder-img').style.display = 'none';
        document.getElementById('chat-header').classList.remove('hidden');
        document.getElementById('messages-container').classList.remove('hidden');
        document.getElementById('input-area').classList.remove('hidden');

        // 3. Клиентті тізімге қосу
        const list = document.getElementById('client-list');
        list.innerHTML = `
            <div class="p-4 border-b bg-orange-100 border-l-4 border-orange-600 cursor-pointer animate-pulse">
                <div class="flex justify-between items-center">
                    <span class="font-bold">Клиент ${data.id}</span>
                    <span class="text-[10px] text-gray-500">${data.time}</span>
                </div>
                <p class="text-sm text-gray-600 truncate">${data.message}</p>
            </div>
        `;

        // 4. Хатты чатқа шығару
        addMessage(data.message, 'user');

        // Триггерді өшіру (қайта-қайта шықпауы үшін)
        localStorage.setItem('new_chat_request', 'false');
    }
}

// Әр 1.5 секунд сайын тексеру
setInterval(checkIncomingMessages, 1500);


function adminReply() {
    const input = document.getElementById('admin-input');
    const text = input.value.trim();
    if (!text) return;

    // ... (админ интерфейсіне хат қосу коды)

    // Клиентке жіберу
    localStorage.setItem('admin_last_msg', text);
    localStorage.setItem('admin_reply_trigger', 'true');
    
    // Клиенттің чат уақытын тағы 10 минутқа созу (Триггер арқылы)
    localStorage.setItem('extend_chat_time', 'true');

    input.value = '';
}

window.addEventListener('DOMContentLoaded', () => {
    loadChatFromStorage(); // Бетті жаңартқанда чатты қайтару
    
    // Админнің жауабын және уақытты созуды тыңдау
    window.addEventListener('storage', (e) => {
        if (e.key === 'admin_reply_trigger' && e.newValue === 'true') {
            // ... (маманның хатын чатқа қосу коды)
            saveChatToStorage(); // Хат келгенде сақтау
        }
    });
});