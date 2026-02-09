import '../css/style.css';

const container = document.getElementById('feed-container');

// URL вашего бекенда на Render (замените на реальный после деплоя)
const API_URL = 'https://webworkers-serviceworkers-backend.onrender.com'; 
// Для локальной разработки:
// const API_URL = 'http://localhost:7070/news';

function renderSkeleton() {
    let html = '';
    for (let i = 0; i < 3; i++) {
        html += `
            <div class="news-item skeleton">
                <div class="news-image"></div>
                <div class="news-content">
                    <div class="news-title"></div>
                    <div class="news-description-line"></div>
                    <div class="news-description-line"></div>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function renderData(news) {
    let html = '';
    news.forEach(item => {
        html += `
            <div class="news-item">
                <img src="${item.image}" alt="img" class="news-image">
                <div class="news-content">
                    <div class="news-title">${item.title}</div>
                    <div class="news-description">${item.description}</div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderError() {
    container.innerHTML = `
        <div class="error-message">
            <h2>Не удалось загрузить данные</h2>
            <p>Проверьте подключение и обновите страницу.</p>
        </div>
    `;
}

async function init() {
    renderSkeleton();

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const json = await response.json();
        renderData(json.data);
    } catch (error) {
        console.error('Fetch error:', error);
        renderError();
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

init();