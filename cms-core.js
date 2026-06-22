// --- КЕЗ КЕЛГЕН БЕТТЕГІ МӘТІНДЕРДІ АВТОМАТТЫ АУЫСТЫРУ ---
function applyGlobalCMS() {
    try {
        // Басқару панелінен сақталған мәтіндерді оқу
        const globalTexts = JSON.parse(localStorage.getItem('qulan_global_cms')) || {};
        
        // Сайттағы "data-cms" белгісі бар барлық элементтерді автоматты түрде табу
        document.querySelectorAll('[data-cms]').forEach(el => {
            const key = el.getAttribute('data-cms');
            
            // Егер осы кілтке жаңа мәтін жазылған болса, оны қоямыз
            if (globalTexts[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = globalTexts[key]; // Инпуттардың ішіндегі жазу үшін
                } else {
                    el.innerText = globalTexts[key]; // Жай мәтіндер мен батырмалар үшін
                }
            }
        });
    } catch (e) {
        console.error("CMS мәтіндерін жүктеуде қате шықты:", e);
    }
}

// Бет жүктелгенде автоматты түрде іске қосылады
document.addEventListener('DOMContentLoaded', applyGlobalCMS);