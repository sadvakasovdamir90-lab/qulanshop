// Функция для переключения между формами (Вход / Регистрация / Забыли пароль)
function showForm(formName) {
    document.getElementById('reg-block').classList.add('hidden');
    document.getElementById('login-block').classList.add('hidden');
    document.getElementById('forgot-block').classList.add('hidden');
    document.getElementById('otp-block').classList.add('hidden');

    document.getElementById(formName + '-block').classList.remove('hidden');
}

// Функция для показа блока с 6-значным кодом
let timerInterval;
function showOtp(prevForm) {
    // Сохраняем, из какой формы пришли, чтобы кнопка "Изменить данные" знала куда вернуться
    window.currentOrigin = prevForm; 
    
    document.getElementById('reg-block').classList.add('hidden');
    document.getElementById('login-block').classList.add('hidden');
    document.getElementById('forgot-block').classList.add('hidden');
    document.getElementById('otp-block').classList.remove('hidden');
    
    startTimer();
}

function goBackFromOtp() {
    showForm(window.currentOrigin || 'reg');
    clearInterval(timerInterval);
}

// Логика Таймера 1:00
function startTimer() {
    let time = 60;
    const timerDisplay = document.getElementById('timer');
    const resendBtn = document.getElementById('resend-btn');
    
    resendBtn.disabled = true;
    resendBtn.classList.replace('text-orange-600', 'text-gray-400');

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        timerDisplay.innerHTML = `0${minutes}:${seconds}`;
        
        if (time <= 0) {
            clearInterval(timerInterval);
            resendBtn.disabled = false;
            resendBtn.classList.replace('text-gray-400', 'text-orange-600');
            resendBtn.classList.add('cursor-pointer');
        }
        time--;
    }, 1000);
}

// Авто-фокус на следующую ячейку OTP
const inputs = document.querySelectorAll('.otp-input');
inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
});

function showTab(tabId) {
    // Барлық контентті жасыру
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Барлық батырмалардан "активный" стильді алып тастау
    document.querySelectorAll('.tab-link').forEach(link => {
        link.classList.remove('bg-orange-50', 'text-orange-600', 'font-medium');
    });

    // Керекті блокты көрсету
    document.getElementById(tabId).classList.remove('hidden');

    // Басылған батырмаға стиль беру
    event.currentTarget.classList.add('bg-orange-50', 'text-orange-600', 'font-medium');
}

// Чатты ашып-жабу
function toggleAIChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    chatWindow.classList.toggle('hidden');
}

// Хабарлама жіберу
function sendMessage() {
    const input = document.getElementById('chat-input');
    const container = document.getElementById('chat-messages');
    const text = input.value.trim();

    if (!text) return;

    // Пайдаланушы хабарламасы
    container.innerHTML += `<div class="bg-orange-100 p-3 rounded-2xl shadow-sm self-end ml-auto max-w-[80%] text-right">${text}</div>`;
    input.value = '';
    container.scrollTop = container.scrollHeight;

    // Боттың жауабы (Симуляция)
    setTimeout(() => {
        let botResponse = "";
        
        // Қарапайым логика (болашақта нақты AI-ға қосуға болады)
        if (text.toLowerCase().includes("доставка") || text.toLowerCase().includes("жеткізу")) {
            botResponse = "Біз Құлан ауданы бойынша тез арада жеткізіп береміз!";
        } else if (text.toLowerCase().includes("жұмыс") || text.toLowerCase().includes("время")) {
            botResponse = "Біз күн сайын сағат 09:00-ден 20:00-ге дейін жұмыс істейміз.";
        } else {
            // Егер бот түсінбесе, маманға аударуды ұсынады
            botResponse = `Кешіріңіз, бұл сұраққа нақты жауап бере алмай тұрмын. <b>Маманға (специалист) аударайын ба?</b><br><br>
            <button onclick="connectToHuman()" class="bg-green-500 text-white px-3 py-1 rounded-lg text-xs mt-2 italic font-bold">Иә, WhatsApp-қа өту</button>`;
        }

        container.innerHTML += `<div class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 max-w-[80%]">${botResponse}</div>`;
        container.scrollTop = container.scrollHeight;
    }, 1000);
}

// Маманға WhatsApp арқылы бағыттау
function connectToHuman() {
    const whatsappNumber = "77000000000"; // Осы жерге өз нөміріңді жаз
    const message = "Сәлеметсіз бе! Маған көмек қажет.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

// Input-та Enter басса жіберу
document.getElementById('chat-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});


function changeLanguage(lang) {
    // Таңдалған тілді жадқа сақтау (бетті жаңартқанда сақталып тұру үшін)
    localStorage.setItem('qulan_lang', lang);
    
    // Мәтіндер базасы
    const translations = {
        kz: {
            footer_desc: "Құлан ауылындағы ең ірі және сенімді интернет-дүкен. Біз сапа мен жылдамдықты таңдаймыз!",
            useful: "Пайдалы",
            delivery: "Жеткізу және төлеу",
            returns: "Тауарды қайтару",
            cards: "Сыйлық карталары",
            company: "Компания",
            about: "Біз туралы",
            contacts: "Байланыс",
            address: "Дүкен мекен-жайы",
            schedule_title: "Жұмыс кестесі:",
            schedule_days: "Күн сайын: 09:00 - 20:00",
            rights: "© 2026 QulanShop. Барлық құқықтар қорғалған."
        },
        ru: {
            footer_desc: "Крупнейший и надежный интернет-магазин в селе Кулан. Мы выбираем качество и скорость!",
            useful: "Полезное",
            delivery: "Доставка и оплата",
            returns: "Возврат товара",
            cards: "Подарочные карты",
            company: "Компания",
            about: "О нас",
            contacts: "Контакты",
            address: "Адрес магазина",
            schedule_title: "График работы:",
            schedule_days: "Ежедневно: 09:00 - 20:00",
            rights: "© 2026 QulanShop. Все права защищены."
        }
    };

    const t = translations[lang];

    // Footer-дегі мәтіндерді ауыстыру (ID арқылы)
    document.getElementById('f-desc').innerText = t.footer_desc;
    document.getElementById('f-useful-title').innerText = t.useful;
    document.getElementById('f-delivery').innerText = t.delivery;
    document.getElementById('f-returns').innerText = t.returns;
    document.getElementById('f-cards').innerText = t.cards;
    document.getElementById('f-company-title').innerText = t.company;
    document.getElementById('f-about').innerText = t.about;
    document.getElementById('f-contacts').innerText = t.contacts;
    document.getElementById('f-address').innerText = t.address;
    document.getElementById('f-schedule-title').innerText = t.schedule_title;
    document.getElementById('f-schedule-days').innerText = t.schedule_days;
    document.getElementById('f-rights').innerText = t.rights;
}

// Бет жүктелгенде сақталған тілді қолдану
window.onload = () => {
    const savedLang = localStorage.getItem('qulan_lang') || 'ru';
    changeLanguage(savedLang);
};


// Чатты ашу немесе жабу
function toggleAIChat() {
    const chatWin = document.getElementById('ai-chat-window');
    chatWin.classList.toggle('hidden');
}

// Хабарлама жіберу логикасы
function sendMessage() {
    const input = document.getElementById('chat-input');
    const container = document.getElementById('chat-messages');
    
    if (input.value.trim() !== "") {
        // Пайдаланушының хабарламасы
        const userMsg = `
            <div class="flex justify-end">
                <div class="bg-orange-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-md">
                    ${input.value}
                </div>
            </div>`;
        
        container.innerHTML += userMsg;
        const currentText = input.value; // Мәтінді сақтап қалу
        input.value = ""; // Енгізу өрісін тазалау
        
        // Автоматты түрде төменге түсіру
        container.scrollTop = container.scrollHeight;

        // Егер script.js-де жауап беру функциясы болса, соны шақыру
        if (typeof handleBotResponse === "function") {
            handleBotResponse(currentText);
        }
    }
}


// Парольді көрсету/жасыру функциясы
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

// Парольді ауыстыру логикасы
function changePassword() {
    const currentPass = document.getElementById('current-password');
    const errorMsg = document.getElementById('error-msg');
    
    // Мысал үшін ескі пароль: 123456
    if (currentPass.value !== "123456") {
        errorMsg.classList.remove('hidden');
        currentPass.classList.add('border-red-500');
    } else {
        errorMsg.classList.add('hidden');
        currentPass.classList.remove('border-red-500');
        alert("Пароль сәтті өзгертілді!");
    }
}


// Google арқылы тіркелу/кіру функциясы
async function signInWithGoogle() {
    // Firebase Google провайдерін қосу
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
        // Google терезесін ашу
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        
        console.log("Успешный вход:", user.displayName);
        
        // Тіркелгеннен кейін профильге жіберу
        location.href = 'profile.html';
        
    } catch (error) {
        console.error("Ошибка при входе:", error.message);
        alert("Ошибка входа через Google: " + error.message);
    }
}


