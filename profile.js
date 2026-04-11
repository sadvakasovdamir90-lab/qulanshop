
// Файл таңдалғанда атын өзгерту
document.getElementById('support-file')?.addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : "Прикрепить скриншот";
    const label = document.getElementById('file-name');
    if (label) {
        label.innerText = fileName.toUpperCase();
        label.classList.add('text-orange-600');
    }
});

// Форманы жіберу (Суретті оқу мүмкіндігімен)
document.getElementById('support-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const originalContent = btn.innerHTML;
    const fileInput = document.getElementById('support-file');

    // Жүктелу анимациясы
    btn.innerHTML = '<i class="fas fa-circle-notch animate-spin"></i>';
    btn.disabled = true;

    // СУРЕТТІ ОҚУ (Егер файл таңдалса)
    let imageData = null;
    if (fileInput.files[0]) {
        imageData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result); // Суретті кодқа айналдыру
            reader.readAsDataURL(fileInput.files[0]);
        });
    }

    // Мәліметтерді жинау
    const ticket = {
        id: "TICK-" + Date.now().toString().slice(-6),
        name: document.getElementById('sup-name').value,
        contact: document.getElementById('sup-contact').value,
        message: document.getElementById('sup-message').value,
        image: imageData, // Нақты сурет осы жерде сақталады
        date: new Date().toLocaleString(),
        status: 'new'
    };

    // LocalStorage-қа сақтау
    let tickets = JSON.parse(localStorage.getItem('support_tickets')) || [];
    tickets.push(ticket);
    localStorage.setItem('support_tickets', JSON.stringify(tickets));
    localStorage.setItem('new_chat_request', 'true');

    // Сәтті жіберілгені туралы хабарлама
    setTimeout(() => {
        Swal.fire({
            title: '<span class="font-black uppercase tracking-tighter">Заявка принята!</span>',
            html: `
                <div class="text-center p-2">
                    <p class="text-[11px] font-bold text-gray-500 uppercase leading-relaxed">
                        Спасибо! Мы получили ваше сообщение.<br>
                        Менеджер свяжется с вами в течение <span class="text-orange-600">15 минут</span></p>
                </div>
            `,
            icon: 'success',
            iconColor: '#ea580c',
            confirmButtonText: 'ОТЛИЧНО',
            confirmButtonColor: '#000',
            customClass: {
                popup: 'rounded-[2.5rem]',
                confirmButton: 'rounded-2xl px-10 py-4 font-black uppercase text-[10px] tracking-widest'
            }
        });

        // Форманы тазалау
        this.reset();
        btn.innerHTML = originalContent;
        btn.disabled = false;
        const fileNameLabel = document.getElementById('file-name');
        if (fileNameLabel) {
            fileNameLabel.innerText = "Прикрепить скриншот";
            fileNameLabel.classList.remove('text-orange-600');
        }
    }, 1000);
});
</script>

<!-- Скрипт бөлімі -->
<script>
function updateOnlineStatus() {
    const overlay = document.getElementById('offline-overlay');
    if (!navigator.onLine) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
window.addEventListener('DOMContentLoaded', updateOnlineStatus);
window.addEventListener('load', () => {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.classList.add('opacity-0'); // Әдемі жоғалу эффекті
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); // 0.5 секундтан кейін толық өшеді
    }
});
</script>

<script>
        // --- 0. СЕССИЯНЫ ТЕКСЕРУ (NEW) ---
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.assign('auth.html');
        return;
    }
    
    // БӘРІНЕН БҰРЫН ОСЫ ФУНКЦИЯ ТҰРУЫ КЕРЕК
    loadUserData();      
    updateDebtStatus();  
    renderProfileCart(); 
    load2FAStatus();     
    renderCertificates(); 
    updateMenuBadges();   
    updateOnlineStatus(); 
    updateNavBalance();  
});
        // --- 1. ТАБТАР ЖҮЙЕСІ ---
        function showTab(event, tabId) {
            
            const currentId = localStorage.getItem('currentUserId');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            document.querySelectorAll('.nav-btn').forEach(b => {
                b.classList.remove('bg-orange-50', 'text-orange-600', 'font-medium');
                b.classList.add('hover:bg-gray-100');
                
            });
            const activeTab = document.getElementById(tabId);
            if (activeTab) activeTab.classList.remove('hidden');
            event.currentTarget.classList.add('bg-orange-50', 'text-orange-600', 'font-medium');
            event.currentTarget.classList.remove('hover:bg-gray-100');

            // --- Сертификаттар табы ашылғанда "NEW" белгісін жоғалту ---
            if (tabId === 'tab-certificates') {
                localStorage.setItem('certs_read_' + currentId, 'true');
                renderCertificates();
                updateMenuBadges(); 

            }
        }

        // Кошелекті рендер жасау
function renderWallet() {
    const balance = localStorage.getItem('userBalance') || 0;
    const bonuses = localStorage.getItem('userBonuses') || 0;
    
    // Экрандағы баланстарды жаңарту
    const mainBalanceEl = document.getElementById('wallet-balance-main');
    const bonusEl = document.getElementById('wallet-bonuses');
    
    if(mainBalanceEl) mainBalanceEl.innerText = Number(balance).toLocaleString() + ' ₸';
    if(bonusEl) bonusEl.innerText = Number(bonuses).toLocaleString();
    
    // Навигациядағы балансты да жаңарту
    updateNavBalance(); 
}

// Пополнить басқанда әдістерді көрсету
function showPayMethods() {
    const amount = document.getElementById('topup-amount').value;
    if(!amount || amount < 100) {
        showToast("Введите сумму от 100 ₸", "error");
        return;
    }
    
    const methods = document.getElementById('pay-methods');
    methods.classList.remove('hidden');
    // Мобильді браузерде төменге автоматты түрде жылжыту
    methods.scrollIntoView({ behavior: 'smooth' });
}

// Төлем әдісін таңдау
function processTopUp(method) {
    const amount = document.getElementById('topup-amount').value;
    if(method === 'kaspi') {
        // Мысалы, Каспи QR модальді терезесін ашуға болады
        alert(`Для пополнения на ${amount} ₸, отсканируйте Kaspi QR в приложении. Баланс обновится после проверки.`);
    }
}

        // --- 2. GEMINI AI CHAT ENGINE ---
        const GEMINI_API_KEY = "AIzaSyBU1eWfKxsuIJshtMzUlR4YKucfuRTvWog"; 
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        function toggleAIChat() { 
            document.getElementById('ai-chat-window').classList.toggle('hidden'); 
        }

        async function queryGemini(userMessage) {
            const systemInstruction = `
                Ты — Qulan AI, официальный помощник интернет-магазина QulanShop (село Кулан). 
                Твоя задача: помогать клиентам. 
                Информация о магазине: 
                - График: 09:00 - 20:00 (ежедневно). 
                - Доставка: по всему району Кулан. 
                - Владелец: ИП "QulanShop".
                - Оплата: Kaspi Pay, Halyk Bank.
                Отвечай кратко, дружелюбно, используй эмодзи. 
                Если клиент спрашивает на казахском, отвечай на казахском. Если на русском — на русском.
                Текст пользователя: ${userMessage}
            `;

            try {
                const response = await fetch(GEMINI_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: systemInstruction }] }]
                    })
                });
                const data = await response.json();
                return data.candidates[0].content.parts[0].text;
            } catch (e) {
                return "Кешіріңіз, байланыс үзілді. Қайта байқап көріңізші. 🛠️";
            }
        }

        async function sendMessage() {
            const input = document.getElementById('chat-input');
            const container = document.getElementById('chat-messages');
            const text = input.value.trim();
            if (!text) return;

            container.innerHTML += `
                <div class="flex justify-end mb-2">
                    <div class="bg-orange-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm text-xs italic font-medium">
                        ${text}
                    </div>
                </div>`;
            input.value = "";
            container.scrollTop = container.scrollHeight;

            const typingId = "typing-" + Date.now();
            container.innerHTML += `
                <div id="${typingId}" class="flex justify-start mb-2">
                    <div class="bg-gray-200 text-gray-600 p-2 rounded-xl text-[10px] animate-pulse">
                        Qulan AI жауап жазуда...
                    </div>
                </div>`;
            
            const aiReply = await queryGemini(text);
            const typingElem = document.getElementById(typingId);
            if(typingElem) typingElem.remove();

            container.innerHTML += `
                <div class="flex justify-start mb-2">
                    <div class="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none max-w-[85%] shadow-md text-xs text-gray-700 italic">
                        ${aiReply}
                    </div>
                </div>`;
            container.scrollTop = container.scrollHeight;
        }

        // --- 3. ҚАРЫЗ СТАТУСЫН ЖАҢАРТУ ---
        function updateDebtStatus() {
            const currentId = localStorage.getItem('currentUserId');
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.id == currentId);

            if (!user) return;

            const startDateElem = document.getElementById('debt-start-date');
            const amountElem = document.getElementById('debt-amount');
            const card = document.getElementById('debt-card');
            const text = document.getElementById('debt-warning-text');
            const btn = document.getElementById('pay-button');
            const notice = document.getElementById('restriction-notice');
            
            const debtDetails = document.getElementById('debt-details');
            const orderNumElem = document.getElementById('debt-order-number');

            const debt = user.debt || 0;
            const debtDate = user.debtDate || null;
            const orderNum = user.lastDebtOrder || "#QS-000000";

            amountElem.innerText = debt.toLocaleString() + " ₸";

            if (debt <= 0) {
                if (debtDetails) debtDetails.classList.add('hidden'); 
                card.className = "flex flex-col md:flex-row items-center justify-between p-6 bg-green-50 rounded-[2.5rem] border border-green-200 gap-6";
                text.innerText = "Ваш баланс в порядке. Статус: Стабильный";
                text.className = "text-[10px] mt-2 font-bold uppercase text-green-600 italic";
                amountElem.className = "text-4xl md:text-5xl font-black text-green-600 mt-1 italic";
                if (btn) btn.classList.add('hidden');
                if (notice) notice.classList.add('hidden');
                return;
            }

            if (debtDetails) debtDetails.classList.remove('hidden'); 
            if (btn) btn.classList.remove('hidden');
            if (startDateElem) startDateElem.innerText = debtDate;
            if (orderNumElem) orderNumElem.innerText = orderNum;
            
            const startDate = new Date(debtDate);
            const now = new Date();
            const diffDays = Math.ceil(Math.abs(now - startDate) / (1000 * 60 * 60 * 24));
            const diffMonths = diffDays / 30;

            if (diffMonths <= 1) {
                card.className = "flex flex-col md:flex-row items-center justify-between p-6 bg-green-50 rounded-[2.5rem] border border-green-200 gap-6";
                text.innerText = "Срок оплаты в норме. Статус: Стабильный";
                text.className = "text-[10px] mt-2 font-bold uppercase text-green-600 italic";
                amountElem.className = "text-4xl md:text-5xl font-black text-green-600 mt-1 italic";
                if (btn) btn.className = "w-full md:w-auto bg-green-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition shadow-lg uppercase tracking-wider";
            } else if (diffMonths <= 2) {
                card.className = "flex flex-col md:flex-row items-center justify-between p-6 bg-yellow-50 rounded-[2.5rem] border border-yellow-200 gap-6";
                text.innerText = "Внимание! Идет второй month задолженности";
                text.className = "text-[10px] mt-2 font-bold uppercase text-yellow-700 italic";
                amountElem.className = "text-4xl md:text-5xl font-black text-yellow-600 mt-1 italic";
                if (btn) btn.className = "w-full md:w-auto bg-yellow-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-600 transition shadow-lg uppercase tracking-wider";
            } else {
                card.className = "flex flex-col md:flex-row items-center justify-between p-6 bg-red-50 rounded-[2.5rem] border border-red-200 gap-6";
                text.innerText = "КРИТИЧЕСКИЙ СРОК! Срочно погасите долг";
                text.className = "text-[10px] mt-2 font-bold uppercase text-red-600 italic";
                amountElem.className = "text-4xl md:text-5xl font-black text-red-600 mt-1 italic";
                if (btn) btn.className = "w-full md:w-auto bg-red-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition shadow-lg animate-bounce uppercase tracking-wider";
                if (diffMonths >= 3 && notice) notice.classList.remove('hidden');
            }
        }

        // --- 4. СЕБЕТТІ БАСҚАРУ ---
      function renderProfileCart() {
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const cartFooter = document.getElementById('cart-footer');
    const totalPriceElem = document.getElementById('cart-total-price');
    
    if (!cartItemsList) return;
    let cart = JSON.parse(localStorage.getItem('qulanCart')) || [];

    if (cart.length === 0) {
        cartItemsList.innerHTML = '';
        if (emptyMsg) emptyMsg.classList.remove('hidden');
        if (cartFooter) cartFooter.classList.add('hidden');
        updateMenuBadges();
        return;
    }

    if (emptyMsg) emptyMsg.classList.add('hidden');
    if (cartFooter) cartFooter.classList.remove('hidden');
    
    let total = 0;
    let htmlContent = '';

    cart.forEach((item, index) => {
        const price = parseInt(item.price) || 0;
        const qty = item.quantity || 1;
        total += price * qty;

        // --- СУРЕТТІ АНЫҚТАУ БӨЛІМІ (ТҮЗЕТІЛДІ) ---
        // Егер 'image' бос болса, 'img' немесе 'icon' кілттерін тексереді
        const itemImg = item.img || item.image || item.icon || 'images/no-photo.jpg';

        htmlContent += `
            <div class="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-3 animate-modal">
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-orange-500 overflow-hidden border shrink-0">
                         <img src="${itemImg}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/150'">
                    </div>
                    <div>
                        <h4 class="font-bold text-sm text-gray-800">${item.name}</h4>
                        <p class="text-orange-600 font-black text-sm">${price.toLocaleString()} ₸ ${qty > 1 ? 'x'+qty : ''}</p>
                    </div>
                </div>
                <button type="button" onclick="removeFromCart(${index})" class="text-gray-300 hover:text-red-500 p-2 transition active:scale-90">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    });
    cartItemsList.innerHTML = htmlContent;
    if (totalPriceElem) totalPriceElem.innerText = total.toLocaleString() + ' ₸';
    updateMenuBadges();
}

        function removeFromCart(index) {
            let cart = JSON.parse(localStorage.getItem('qulanCart')) || [];
            cart.splice(index, 1);
            localStorage.setItem('qulanCart', JSON.stringify(cart));
            renderProfileCart();
        }

        // --- 5. ПРОФИЛЬ ДЕРЕКТЕРІН БАСҚАРУ ---
       function loadUserData() {
    // 1. ДЕРЕКТЕРДІ ОҚУ
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentId = localStorage.getItem('currentUserId');
    const userJson = localStorage.getItem('currentUser');
    
    // БАЗАДАН ҚОЛДАНУШЫНЫ ТАБУ (Сенің жазған логикаң)
    const currentUser = users.find(u => u.id == currentId);

    // 2. ИНТЕРФЕЙСКЕ ШЫҒАРУ (Сенің мәтіндерің мен ID-лерің)
    if (currentUser) {
        if (document.getElementById('user-fullname-header')) 
            document.getElementById('user-fullname-header').innerText = currentUser.name;
        
        if (document.getElementById('user-fullname-input')) 
            document.getElementById('user-fullname-input').value = currentUser.name;

        if (document.getElementById('user-phone-input')) 
            document.getElementById('user-phone-input').value = currentUser.phone || '';

        if (document.getElementById('user-email-input')) 
            document.getElementById('user-email-input').value = currentUser.email || '';

        if (document.getElementById('user-address-input')) 
            document.getElementById('user-address-input').value = currentUser.address || '';
        
        // ФОТОНЫ ШЫҒАРУ (Артық емес, қажетті код)
        const avatarImg = document.getElementById('user-avatar');
        if (avatarImg) {
            avatarImg.src = currentUser.photo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser.name) + "&background=random";
        }
    }

    // 3. БАЛАНСТЫ ТЕҢЕСТІРУ (Сенің қосқан бөлімің)
    if (userJson) {
        const sessionUser = JSON.parse(userJson);
        const dbUser = users.find(u => String(u.id) === String(sessionUser.id));
        
        if (dbUser) {
            // КОШЕЛЕККЕ АҚШАНЫ ОСЫ ЖЕРДЕ ТЕҢЕСТІРЕМІЗ
            localStorage.setItem('userBalance', dbUser.userBalance || 0);
            
            // Навигациядағы балансты бірден жаңарту
            if (typeof updateNavBalance === 'function') updateNavBalance();
        }
    }

    // 4. ҚАТЕЛЕРДІ ТЕКСЕРУ (Сенің try-catch блогың)
    try {
        if (!userJson) throw new Error("Деректер бос");

        const user = JSON.parse(userJson);
        const displayName = user.name || "Пользователь";
        
        if (document.getElementById('user-fullname-header'))
            document.getElementById('user-fullname-header').innerText = displayName;

    } catch (e) {
        console.error("Деректерді оқу мүмкін болмады:", e);
        // Егер деректер қате болса, сессияны тазалап, логин бетіне жібереміз
        if (typeof handleLogout === 'function') handleLogout(); 
    }
}

        // Фотоны жүктеп, базаға сақтау функциясы
function uploadAvatar(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const base64Image = e.target.result; // Суреттің коды
            
            // 1. Экранда бірден көрсету
            document.getElementById('user-avatar').src = base64Image;
            
            // 2. Уақытша currentUser нысанын жаңарту (сақтау батырмасын басқанда толық сақталады)
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                currentUser.photo = base64Image; // немесе 'photo', сенің newUser құрылымыңа сәйкес
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        };

        reader.readAsDataURL(input.files[0]);
    }

    // 1. LocalStorage-тан деректі алу
    const userJson = localStorage.getItem('currentUser');
    
    // Элементтерді айнымалыға алу
    const headerName = document.getElementById('user-fullname-header');
    const nameInput = document.getElementById('user-fullname-input');
    const avatarImg = document.getElementById('user-avatar');

    if (userJson && userJson !== "null") {
        const user = JSON.parse(userJson);
        
        // 2. АТЫН АНЫҚТАУ (newUser құрылымына сәйкес тексереміз)
        // Сенің нысаныңда 'name' қолданылады
        const displayName = user.name || user.displayName || user.username || "Пользователь";

        // 3. Экранға шығару (Header және Инпут)
        if (headerName) headerName.innerText = displayName;
        if (nameInput) nameInput.value = displayName;

        // 4. СУРЕТТІ ШЫҒАРУ ( newUser ішіндегі 'photo' өрісі)
        if (avatarImg) {
            // Егер сурет базада болса соны, болмаса 'photo'-ны, болмаса әдемі иконканы қояды
            avatarImg.src = user.avatar || user.photo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(displayName) + "&background=random";
        }

        // 5. БАСҚА ДЕРЕКТЕРДІ ТОЛТЫРУ
        if (document.getElementById('user-phone-input')) 
            document.getElementById('user-phone-input').value = user.phone || '';
        
        if (document.getElementById('user-email-input')) 
            document.getElementById('user-email-input').value = user.email || '';

        if (document.getElementById('user-address-input')) 
            document.getElementById('user-address-input').value = user.address || '';

        console.log("Профиль сәтті жаңартылды:", displayName);
    } else {
        window.location.assign('auth.html');
    }

}


        // --- 6. ПАРОЛЬ ЖӘНЕ ҚАУІПСІЗДІК ---
        function togglePass(inputId, btn) {
            const input = document.getElementById(inputId);
            const icon = btn.querySelector('i');
            if (input.type === "password") {
                input.type = "text";
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = "password";
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        }

        function changePassword() {
            const currentPassInput = document.getElementById('current-password');
            const newPassInput = document.getElementById('new-password');
            const errorMsg = document.getElementById('error-msg');
            const successMsg = document.getElementById('success-msg');

            const currentId = localStorage.getItem('currentUserId');
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.id == currentId);

            if (userIndex !== -1) {
                if (currentPassInput.value !== users[userIndex].password) {
                    errorMsg.classList.remove('hidden');
                    currentPassInput.classList.add('border-red-500');
                    return;
                }

                if (newPassInput.value.length < 6) {
                    Swal.fire('Ошибка', 'Новый пароль должен быть не менее 6 символов', 'warning');
                    return;
                }

                users[userIndex].password = newPassInput.value;
                localStorage.setItem('users', JSON.stringify(users));
                
                errorMsg.classList.add('hidden');
                currentPassInput.classList.remove('border-red-500');
                successMsg.classList.remove('hidden');
                currentPassInput.value = "";
                newPassInput.value = "";
                setTimeout(() => successMsg.classList.add('hidden'), 3000);
            }
        }

        function toggle2FA() {
            const checkbox = document.getElementById('2fa-toggle');
            const statusText = document.getElementById('2fa-status-text');
            const infoBox = document.getElementById('2fa-info');
            
            const currentId = localStorage.getItem('currentUserId');
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.id == currentId);

            if (userIndex !== -1) {
                users[userIndex].twoFactorEnabled = checkbox.checked;
                localStorage.setItem('users', JSON.stringify(users));

                if (checkbox.checked) {
                    statusText.innerText = "В данный момент: Включено";
                    statusText.classList.add('text-orange-600', 'font-bold');
                    infoBox.classList.remove('hidden');
                    Swal.fire('Защита включена', 'Теперь при каждом входе потребуется подтверждение по Email', 'success');
                } else {
                    statusText.innerText = "В настоящее время: Отключено";
                    statusText.classList.remove('text-orange-600', 'font-bold');
                    infoBox.classList.add('hidden');
                    Swal.fire('Защита отключена', 'Ваш аккаунт защищен только паролем', 'info');
                }
            }
        }

        function load2FAStatus() {
            const currentId = localStorage.getItem('currentUserId');
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.id == currentId);
            
            if (user && user.twoFactorEnabled) {
                const checkbox = document.getElementById('2fa-toggle');
                const statusText = document.getElementById('2fa-status-text');
                const infoBox = document.getElementById('2fa-info');
                
                if (checkbox) checkbox.checked = true;
                if (statusText) {
                    statusText.innerText = "В данный момент: Включено";
                    statusText.classList.add('text-orange-600', 'font-bold');
                }
                if (infoBox) infoBox.classList.remove('hidden');
            }
        }

        // --- 7. ТӨЛЕМ ЖӘНЕ TOAST ---
        function openPayment() {
            const modal = document.getElementById('payment-modal');
            const modalContent = modal.querySelector('div');
            modal.classList.remove('hidden');
            modalContent.classList.add('animate-modal');
        }

       function closePayment(isPaid = false) {
    // ... сенің төлем кодының логикасы
    if (isPaid) {
        // Мысалы, қарызды 0 қылған соң:
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.debt = 0;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // БЕЛГІЛЕРДІ ДЕРЕУ ЖАҢАРТУ
        updateMenuBadges();
        
        Swal.fire('Сәтті!', 'Қарызыңыз өтелді', 'success');
    }
}

        function showToast() {
            const toast = document.getElementById('custom-toast');
            toast.classList.remove('opacity-0', '-translate-y-10');
            toast.classList.add('opacity-100', 'translate-y-0');
            setTimeout(hideToast, 4000);
        }

        function hideToast() {
            const toast = document.getElementById('custom-toast');
            if (toast) {
                toast.classList.remove('opacity-100', 'translate-y-0');
                toast.classList.add('opacity-0', '-translate-y-10');
            }
        }

        // --- 8. LOGOUT ---
        function handleLogout() {
            Swal.fire({
                title: 'Выйти?',
                text: "Вы уверены, что хотите выйти из аккаунта?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#f26522',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Да, выйти',
                cancelButtonText: 'Отмена'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('currentUserId');
                    window.location.assign('auth.html');
                }
            });
        }

        // --- 9. СЕРТИФИКАТТАРДЫ ШЫҒАРУ ---
        function renderCertificates() {
            const list = document.getElementById('certificates-list');
            const currentId = localStorage.getItem('currentUserId');
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.id == currentId);

            if (!user || !user.certificates || user.certificates.length === 0) {
                document.getElementById('no-certificates').classList.remove('hidden');
                return;
            }

            list.innerHTML = user.certificates.map((cert, index) => `
                <div onclick="openCertModal(${index})" class="cert-card-mini ${cert.style} p-5 rounded-[1.8rem] text-white h-44 flex flex-col justify-between shadow-xl animate-modal relative overflow-hidden">
                    <img src="https://i.ibb.co/4ZRXvjwR/qulan.jpg" class="absolute right-[-5%] bottom-[-5%] w-2/3 opacity-20 pointer-events-none mix-blend-overlay rotate-[-15deg]">
                    
                    <div class="relative z-10 flex justify-between items-start">
                        <div class="glass-effect px-2 py-1 rounded-lg text-[10px] font-black italic uppercase">QULANSHOP</div>
                        <div class="w-10 h-10 bg-white/10 rounded-full border border-white/30 p-0.5 overflow-hidden">
                            <img src="https://i.ibb.co/DHYkbZCv/cart.jpg" class="w-full h-full object-cover rounded-full">
                        </div>
                    </div>
                    
                    <div class="relative z-10">
                        <p class="text-[8px] font-bold uppercase opacity-70 italic tracking-widest">Номинал</p>
                        <h3 class="text-2xl font-black italic">${Number(cert.amount).toLocaleString()} ₸</h3>
                    </div>
                    
                    <div class="relative z-10 flex justify-between items-end">
                        <span class="text-[9px] font-mono opacity-60">${cert.code}</span>
                        <div class="glass-effect px-2 py-0.5 rounded-md text-[8px] font-black uppercase">Gift Card</div>
                    </div>
                </div>
            `).join('');
        }

        // --- 10. МЕНЮДЕГІ БЕЛГІШЕЛЕРДІ (BADGES) ЖАҢАРТУ ---
      function updateMenuBadges() {
    const userJson = localStorage.getItem('currentUser');
    const badgeDebt = document.getElementById('badge-debt');
    
    if (userJson && userJson !== "null") {
        const user = JSON.parse(userJson);
        
        // 1. ҚАРЫЗ БЕЛГІСІН БАСҚАРУ
        // Егер қарыз (debt) бар болса және ол 0-ден үлкен болса
        if (user.debt && Number(user.debt) > 0) {
            badgeDebt.classList.remove('hidden'); // Белгіні көрсету
        } else {
            badgeDebt.classList.add('hidden');    // Белгіні жасыру
        }
    }
    
    // Себет белгісін де осы жерде жаңартып кетуге болады
    const badgeCart = document.getElementById('badge-cart');
    let cart = JSON.parse(localStorage.getItem('qulanCart')) || [];
    if (badgeCart) {
        if (cart.length > 0) {
            badgeCart.innerText = cart.length;
            badgeCart.classList.remove('hidden');
        } else {
            badgeCart.classList.add('hidden');
        }
    }
}
        // --- 11. ИНТЕРНЕТТІ БАҚЫЛАУ ---
        function updateOnlineStatus() {
            const overlay = document.getElementById('offline-overlay');
            if (!overlay) return;
            if (!navigator.onLine) {
                overlay.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            } else {
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        // --- 12. МОДАЛЬДІ ТЕРЕЗЕ (КАРТАНЫҢ ҮЛКЕН ТҮРІ) ---
        function openCertModal(index) {
            const currentId = localStorage.getItem('currentUserId');
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.id == currentId);
            const cert = user.certificates[index];

            const modal = document.getElementById('cert-modal');
            const content = document.getElementById('cert-modal-content');
            const wishBox = document.getElementById('modal-wish-container');
            const wishText = document.getElementById('modal-wish-text');
            
            content.innerHTML = `
                <div id="pdf-receipt" class="${cert.style} w-full aspect-[1.6/1] rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white mx-auto animate-modal">
                    <img src="https://i.ibb.co/4ZRXvjwR/qulan.jpg" class="absolute right-[-5%] bottom-[-5%] w-2/3 opacity-20 pointer-events-none mix-blend-overlay rotate-[-15deg]">
                    
                    <div class="flex justify-between items-start relative z-10">
                        <div class="glass-effect px-4 py-2 rounded-2xl border border-white/20">
                            <span class="font-black italic text-sm md:text-xl uppercase">QULANSHOP</span>
                        </div>
                        <div class="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full border-2 border-white/30 p-1 shadow-2xl overflow-hidden">
                            <img src="https://i.ibb.co/DHYkbZCv/cart.jpg" class="w-full h-full object-cover rounded-full">
                        </div>
                    </div>

                    <div class="relative z-10">
                        <p class="text-[10px] md:text-sm font-bold uppercase tracking-[0.3em] opacity-70 mb-1 italic">Номинал подарка</p>
                        <div class="text-4xl md:text-6xl font-black italic tracking-tighter">${Number(cert.amount).toLocaleString()} ₸</div>
                    </div>

                    <div class="flex justify-between items-end relative z-10">
                        <div>
                            <p class="text-[9px] md:text-sm font-mono opacity-50 tracking-widest mb-1">${cert.code}</p>
                            <p class="text-[8px] md:text-xs font-black uppercase tracking-widest opacity-90 italic">Владелец: ${user.name}</p>
                        </div>
                        <div class="glass-effect px-3 py-1.5 rounded-xl text-[10px] md:text-sm font-black uppercase">Gift Card</div>
                    </div>
                </div>
            `;

            if (cert.wish) {
                wishBox.classList.remove('hidden');
                wishText.innerText = cert.wish;
            } else {
                wishBox.classList.add('hidden');
            }

            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            document.getElementById('download-pdf-btn').onclick = () => downloadPDF(cert);
            
            const shareText = `Привет! Мой подарочный сертификат от QulanShop на сумму ${cert.amount} ₸! 🎁 Код: ${cert.code}`;
            document.getElementById('share-wa-btn').onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
            document.getElementById('share-tg-btn').onclick = () => window.open(`https://t.me/share/url?url=QulanShop&text=${encodeURIComponent(shareText)}`);
        }

        function closeCertModal() {
            document.getElementById('cert-modal').classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        async function downloadPDF(cert) {
            const element = document.getElementById('pdf-receipt');
            const btn = document.getElementById('download-pdf-btn');
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Создание...';
            btn.disabled = true;

            const opt = {
                margin: 10,
                filename: `Receipt_${cert.code}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 3, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            try {
                await html2pdf().set(opt).from(element).save();
            } catch (e) {
                alert("Ошибка при загрузке");
            } finally {
                btn.innerHTML = '<i class="fas fa-file-pdf"></i> Скачать PDF чек';
                btn.disabled = false;
            }
        }

        // Event listeners
        document.getElementById('chat-input')?.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') sendMessage();
        });

// Навигациядағы балансты жаңарту функциясы
function updateNavBalance() {
    // LocalStorage-тен балансты аламыз (егер жоқ болса 0)
    const balance = localStorage.getItem('userBalance') || 0;
    const balanceEl = document.getElementById('nav-balance');
    
    if (balanceEl) {
        // Санды әдемі форматта шығару (мысалы: 15 000 ₸)
        balanceEl.innerText = Number(balance).toLocaleString() + ' ₸';
    }
}

let isEditMode = false;

function toggleEditMode() {
    const btn = document.getElementById('edit-profile-btn');
    const phoneInput = document.getElementById('user-phone-input');
    const emailInput = document.getElementById('user-email-input');
    const addressInput = document.getElementById('user-address-input');

    if (!isEditMode) {
        // --- ӨЗГЕРТУ РЕЖИМІН ҚОСУ ---
        isEditMode = true;
        phoneInput.disabled = false;
        emailInput.disabled = false;
        addressInput.disabled = false;
        
        btn.innerText = "Сохранить изменения";
        btn.classList.replace('bg-orange-600', 'bg-green-600'); // Жасыл түске ауыстыру (опционально)
        phoneInput.focus();
    } else {
        // --- САҚТАУ РЕЖИМІН ҚОСУ ---
        saveProfileChanges();
    }
}

function saveProfileChanges() {
    const currentId = localStorage.getItem('currentUserId');
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Сессиядан жаңарған фотоны аламыз
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    const userIndex = users.findIndex(u => String(u.id) === String(currentId));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phone = document.getElementById('user-phone-input').value;
    const email = document.getElementById('user-email-input').value;

if (phone.length < 10) return Swal.fire('Қате', 'Телефон нөмірін толық жазыңыз', 'error');
if (!emailRegex.test(email)) return Swal.fire('Қате', 'Email форматы қате', 'error');

    if (userIndex !== -1) {
        // 1. Мәтіндік деректерді алу
        users[userIndex].phone = document.getElementById('user-phone-input').value;
        users[userIndex].email = document.getElementById('user-email-input').value;
        users[userIndex].address = document.getElementById('user-address-input').value;

        // 2. ФОТОНЫ САҚТАУ (Егер жаңа фото жүктелген болса)
        if (currentUser && currentUser.photo) {
            users[userIndex].photo = currentUser.photo;
        }

        // 3. LocalStorage-ты түгел жаңарту
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

        // 4. Интерфейсті жабу
        isEditMode = false;
        document.getElementById('user-phone-input').disabled = true;
        document.getElementById('user-email-input').disabled = true;
        document.getElementById('user-address-input').disabled = true;

        const btn = document.getElementById('edit-profile-btn');
        btn.innerText = "Изменить данные";
        btn.classList.replace('bg-green-600', 'bg-orange-600');

        Swal.fire({
            icon: 'success',
            title: 'Успешно!',
            text: 'Данные и фото сохранены',
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: 'rounded-[2rem]' }
        });
        
        loadUserData(); // Бетті жаңартып жіберу
    }
}

function renderMyOrders() {
    const container = document.getElementById('my-orders-list');
    const noOrdersMsg = document.getElementById('no-orders-msg');
    const userJson = localStorage.getItem('currentUser');
    
    if (!container || !userJson) return;

    const currentUser = JSON.parse(userJson);
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];

    // Пайдаланушыны телефоны немесе аты арқылы сүзу
    const myOrders = allOrders.filter(ord => 
        (ord.phone && ord.phone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '')) || 
        ord.customer === currentUser.name
    );

    if (myOrders.length === 0) {
        container.innerHTML = '';
        noOrdersMsg.classList.remove('hidden');
        return;
    }

    noOrdersMsg.classList.add('hidden');
    container.innerHTML = myOrders.map(ord => {
        // Статусқа байланысты стильдер
        let statusHtml = '';
        if (ord.status === 'delivering') {
            statusHtml = `<span class="bg-blue-50 text-blue-600 text-[9px] font-black px-3 py-1.5 rounded-lg border border-blue-100 animate-pulse uppercase"><i class="fas fa-truck-fast mr-1"></i> В пути</span>`;
        } else if (ord.status === 'completed') {
            statusHtml = `<span class="bg-green-50 text-green-600 text-[9px] font-black px-3 py-1.5 rounded-lg border border-green-100 uppercase"><i class="fas fa-check-circle mr-1"></i> Доставлено</span>`;
        } else {
            statusHtml = `<span class="bg-orange-50 text-orange-600 text-[9px] font-black px-3 py-1.5 rounded-lg border border-orange-100 uppercase"><i class="fas fa-clock mr-1"></i> Обработка</span>`;
        }

        return `
            <div class="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-white hover:shadow-md">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                        <i class="fas fa-shopping-bag text-orange-500"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">#${ord.id}</span>
                            <span class="text-[9px] font-bold text-gray-300 uppercase">${ord.date}</span>
                        </div>
                        <h4 class="font-black text-sm text-gray-800 uppercase italic leading-tight">${ord.product}</h4>
                    </div>
                </div>
                <div class="flex items-center justify-between w-full md:w-auto gap-6">
                    <div class="text-right">
                        <p class="text-lg font-black text-orange-600 italic leading-none">${ord.total}</p>
                        <p class="text-[8px] text-gray-400 font-bold uppercase mt-1 italic">${ord.payment}</p>
                    </div>
                    ${statusHtml}
                </div>
            </div>
        `;
    }).join('');
}

// Таб ашылғанда тізімді жаңарту
const originalShowTab = showTab;
showTab = function(event, tabId) {
    if (typeof originalShowTab === 'function') originalShowTab(event, tabId);
    if (tabId === 'tab-orders') renderMyOrders();
};


// Реферал жүйесін іске қосу
function initReferralSystem() {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return;
    const user = JSON.parse(userJson);

    // Ссылканы жасау: Гитхабта 404 бермеуі үшін ең дұрыс жолы
    const currentUrl = window.location.href;
    const refLink = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1) + 'auth.html?ref=' + (user.id || '123');
    
    const linkInput = document.getElementById('referral-link');
    if (linkInput) {
        linkInput.value = refLink;
    }

    // Статистиканы жаңарту
    const countDisp = document.getElementById('ref-count-display');
    const earnedDisp = document.getElementById('ref-earned-display');
    
    if (countDisp) countDisp.innerText = user.referralCount || 0;
    if (earnedDisp) earnedDisp.innerText = (user.referralEarned || 0) + ' ₸';
}

function copyReferralLink() {
    const linkInput = document.getElementById('referral-link');
    if (!linkInput) return;
    
    // iPhone мен Android-та 100% көшіру үшін заманауи жолы
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // iOS үшін маңызды

    try {
        navigator.clipboard.writeText(linkInput.value).then(() => {
            showCopySuccess();
        });
    } catch (err) {
        document.execCommand('copy'); // Ескі браузерлерге арналған қосалқы жол
        showCopySuccess();
    }
}

// Хабарлама шығару функциясы
function showCopySuccess() {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Ссылка скопирована! 🚀',
        showConfirmButton: false,
        timer: 1500,
        background: '#1e293b',
        color: '#fff'
    });
}

// showTab функциясын реферал үшін жаңарту
const originalShowTabWithRef = showTab;
showTab = function(event, tabId) {
    if (typeof originalShowTabWithRef === 'function') originalShowTabWithRef(event, tabId);
    if (tabId === 'tab-referral') initReferralSystem();
};
