document.addEventListener('DOMContentLoaded', () => {
    updateGameBalance();
});

function updateGameBalance() {
    const balance = localStorage.getItem('qulan_balance') || '0';
    const balanceEl = document.getElementById('game-balance');
    if (balanceEl) balanceEl.innerText = Number(balance).toFixed(2);
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    document.getElementById(id).classList.remove('flex');
    if (id === 'quiz-modal') clearInterval(quizTimer); // Таймерді тоқтату
}

// ==========================================
// 1. CS:GO РУЛЕТКА ЛОГИКАСЫ
// ==========================================
const possiblePrizes = [
    { type: 'empty', val: 0, name: 'Ештеңе', color: '#94a3b8' },
    { type: 'win', val: 5, name: '5 Q-Coins', color: '#3b82f6' },  /* Көк */
    { type: 'win', val: 10, name: '10 Q-Coins', color: '#a855f7' }, /* Күлгін */
    { type: 'win', val: 20, name: '20 Q-Coins', color: '#ec4899' }, /* Қызғылт */
    { type: 'win', val: 50, name: '50 Q-Coins', color: '#ef4444' }, /* Қызыл */
    { type: 'win', val: 100, name: '100 Q-Coins', color: '#eab308' } /* Алтын */
];

function openRoulette() {
    document.getElementById('roulette-modal').classList.remove('hidden');
    document.getElementById('roulette-modal').classList.add('flex');
    buildCaseSlider();
}

// Кейстің ішіндегі заттарды жасау
function buildCaseSlider() {
    const slider = document.getElementById('case-slider');
    slider.style.transition = 'none';
    slider.style.transform = `translateX(0px)`;
    slider.innerHTML = '';

    for (let i = 0; i < 70; i++) {
        let randomPrize = possiblePrizes[Math.floor(Math.random() * possiblePrizes.length)];
        // Жеңу ықтималдығын азайту үшін 0-ді көбірек қосуға болады
        if(Math.random() > 0.4) randomPrize = possiblePrizes[0]; 

        let el = document.createElement('div');
        el.className = 'case-item';
        el.innerHTML = `
            <i class="${randomPrize.val > 0 ? 'fas fa-coins' : 'far fa-sad-tear'} text-2xl mb-1" style="color: ${randomPrize.color}; text-shadow: 0 0 10px ${randomPrize.color}50;"></i>
            <span class="text-xs font-black italic tracking-tighter" style="color: ${randomPrize.color};">${randomPrize.name}</span>
        `;
        // Жеңімпазды алдын-ала белгілеу (мысалы 55-ші зат)
        if (i === 55) el.id = "winning-item";
        slider.appendChild(el);
    }
}
function spinRoulette() {
    // 1. Аккаунтқа кірген адамды анықтау (Сен логин кезінде қалай сақтасаң, соны жаз)
    // Мен мысал ретінде 'userPhone' деп алдым
    const activeUser = localStorage.getItem('userPhone') || 'guest';
    
    // 2. Енді әр адамның өз кілті болады (Мысалы: roulette_last_played_77012345678)
    const storageKey = 'roulette_last_played_' + activeUser;

    const lastPlayed = localStorage.getItem(storageKey);
    const today = new Date().toDateString();

    if (lastPlayed === today) {
        Swal.fire('Қап!', 'Сен бүгінгі кейсті ашып қойдың. Ертең кел!', 'warning');
        return;
    }

    const slider = document.getElementById('case-slider');
    const btn = document.getElementById('spin-btn');
    btn.disabled = true;
    btn.innerText = "Ашылуда...";

    const winningIndex = 55;
    const winningElement = document.getElementById('winning-item');
    const prizeValue = parseInt(winningElement.innerText) || 0;

    const containerWidth = document.getElementById('case-container').offsetWidth;
    const randomOffset = Math.floor(Math.random() * 80) - 40;
    const targetX = -((winningIndex * 100) + 50 - (containerWidth / 2) + randomOffset);

    setTimeout(() => {
        slider.style.transition = 'transform 6s cubic-bezier(0.1, 0, 0.1, 1)';
        slider.style.transform = `translateX(${targetX}px)`;

        setTimeout(() => {
            // 3. Уақытты тек осы аккаунт үшін сақтаймыз
            localStorage.setItem(storageKey, today);

            if (prizeValue > 0) {
                // БАЛАНСТЫ ДА ЖЕКЕ САҚТАУ КЕРЕК
                const balanceKey = 'qulan_balance_' + activeUser;
                let currentBal = parseFloat(localStorage.getItem(balanceKey) || '0');
                localStorage.setItem(balanceKey, currentBal + prizeValue);
                updateGameBalance();

                Swal.fire({
                    icon: 'success', title: 'ДЖЕКПОТ! 🎁',
                    text: `Сен кейстен ${prizeValue} Q-Coins алдың!`,
                    background: '#0f172a', color: '#fff', confirmButtonColor: '#ea580c'
                });
            } else {
                Swal.fire({
                    icon: 'error', title: 'Сәтсіздік...',
                    text: 'Бұл жолы кейс бос болды. Ертең бағыңды сына!',
                    background: '#0f172a', color: '#fff', confirmButtonColor: '#ea580c'
                });
            }
            btn.disabled = false;
            btn.innerText = "Кейсті ашу";
        }, 6500);
    }, 100);
}

// ==========================================
// 2. БЛИЦ-ВИКТОРИНА ЛОГИКАСЫ (10 Секунд)
// ==========================================
const questions = [
    { q: "Қазақ хандығының алғашқы хандары кімдер?", options: ["Керей мен Жәнібек", "Қасым мен Хақназар", "Тәуке мен Есім", "Абылай мен Кенесары"], ans: 0 },
    { q: "Қазақстандағы ең терең көл?", options: ["Балқаш", "Алакөл", "Байкал", "Зайсан"], ans: 3 },
    { q: "«Абай жолы» романының авторы кім?", options: ["Сәбит Мұқанов", "Мұхтар Әуезов", "Ілияс Есенберлин", "Мағжан Жұмабаев"], ans: 1 },
    { q: "Алаш Орда үкіметі қай қалада құрылды?", options: ["Орынбор", "Семей", "Қызылорда", "Алматы"], ans: 0 },
    { q: "Абылай ханның шын есімі кім?", options: ["Әбілқайыр", "Әбілмансұр", "Нұралы", "Сыздық"], ans: 1 },
    // Қосымша 5 сұрақ (10 сұрақ болу үшін)
    { q: "Қазақстанның тұңғыш ғарышкері кім?", options: ["Талғат Мұсабаев", "Айдын Айымбетов", "Тоқтар Әубәкіров", "Юрий Гагарин"], ans: 2 },
    { q: "Алматының бұрынғы атауы?", options: ["Ақмешіт", "Верный", "Целиноград", "Гурьев"], ans: 1 },
    { q: "Екінші дүниежүзілік соғыста екі мәрте Кеңес Одағының батыры атанған ұшқыш?", options: ["Бауыржан Момышұлы", "Талғат Бигелдинов", "Рахымжан Қошқарбаев", "Мәлік Ғабдуллин"], ans: 1 },
    { q: "«Менің атым Қожа» повесін кім жазды?", options: ["Бердібек Соқпақбаев", "Сапарғали Бегалин", "Мұқағали Мақатаев", "Спандияр Көбеев"], ans: 0 },
    { q: "Қазақстандағы ең биік шың?", options: ["Мұзтау", "Хан Тәңірі", "Талғар шыңы", "Белуха"], ans: 1 }
];

let currentQIndex = 0;
let correctAnswers = 0;
let quizTimer;
let timeLeft = 10;

function openQuiz() {
    currentQIndex = 0;
    correctAnswers = 0;
    document.getElementById('quiz-modal').classList.remove('hidden');
    document.getElementById('quiz-modal').classList.add('flex');
    loadQuestion();
}

function loadQuestion() {
    if (currentQIndex >= questions.length) {
        finishQuiz();
        return;
    }

    // Сұрақ пен нұсқаларды шығару
    document.getElementById('q-current').innerText = currentQIndex + 1;
    document.getElementById('question-text').innerText = questions[currentQIndex].q;
    
    const container = document.getElementById('answers-container');
    container.innerHTML = '';

    questions[currentQIndex].options.forEach((opt, index) => {
        container.innerHTML += `
            <button onclick="checkAnswer(${index})" class="w-full text-left px-6 py-4 rounded-2xl border-2 border-slate-100 bg-white font-bold text-slate-600 hover:border-orange-500 hover:bg-orange-50 transition-all active:scale-95 shadow-sm">
                ${opt}
            </button>
        `;
    });

    startTimer();
}

function startTimer() {
    clearInterval(quizTimer);
    timeLeft = 10;
    updateTimerUI();

    quizTimer = setInterval(() => {
        timeLeft--;
        updateTimerUI();

        if (timeLeft <= 0) {
            clearInterval(quizTimer);
            // Уақыт бітсе, қате жауап ретінде саналады да, келесі сұраққа өтеді
            currentQIndex++;
            loadQuestion();
        }
    }, 1000);
}

function updateTimerUI() {
    document.getElementById('quiz-timer-text').innerText = `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;
    const bar = document.getElementById('quiz-timer-bar');
    bar.style.width = `${(timeLeft / 10) * 100}%`;
    
    // Уақыт азайғанда жолақтың түсін қызылға өзгерту
    if (timeLeft <= 3) {
        bar.style.backgroundColor = '#ef4444'; // Red
        document.getElementById('quiz-timer-text').classList.add('animate-pulse', 'text-red-500');
    } else {
        bar.style.backgroundColor = '#ea580c'; // Orange
        document.getElementById('quiz-timer-text').classList.remove('animate-pulse', 'text-red-500');
    }
}

function checkAnswer(selectedIndex) {
    clearInterval(quizTimer);
    if (selectedIndex === questions[currentQIndex].ans) {
        correctAnswers++;
    }
    currentQIndex++;
    loadQuestion();
}

function finishQuiz() {
    clearInterval(quizTimer);
    closeModal('quiz-modal');
    
    if (correctAnswers >= 8) { // 8-ден көп тапса жеңіс
        const reward = correctAnswers * 5; // Әр дұрыс жауапқа 5 Q-Coin
        let currentBal = parseFloat(localStorage.getItem('qulan_balance') || '0');
        localStorage.setItem('qulan_balance', currentBal + reward);
        updateGameBalance();
        
        Swal.fire({
            icon: 'success', title: 'Керемет нәтиже! 🏆',
            text: `Сен ${correctAnswers}/10 сұраққа дұрыс жауап беріп, ${reward} Q-Coins ұтып алдың!`,
            confirmButtonColor: '#ea580c'
        });
    } else {
        Swal.fire({
            icon: 'info', title: 'Жаман емес!',
            text: `Сенің нәтижең: ${correctAnswers}/10. Бонус алу үшін кемінде 8 сұраққа дұрыс жауап беру керек.`,
            confirmButtonColor: '#334155'
        });
    }
}

function updateUserBonus(winScore) {
    const currentId = localStorage.getItem('currentUserId');
    if (!currentId) return;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIdx = users.findIndex(u => String(u.id) === String(currentId));

    if (userIdx !== -1) {
        // 1. Негізгі базада жаңарту
        users[userIdx].bonus = (Number(users[userIdx].bonus) || 0) + winScore;
        localStorage.setItem('users', JSON.stringify(users));

        // 2. Сессияны (currentUser) жаңарту (Профиль көруі үшін)
        localStorage.setItem('currentUser', JSON.stringify(users[userIdx]));

        // 3. Экрандағы санды лезде өзгерту
        const balEl = document.getElementById('game-balance');
        if(balEl) balEl.innerText = users[userIdx].bonus.toFixed(2);
        
        console.log("Бонус сақталды: +" + winScore);
    }
}