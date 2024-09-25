const createPoints = (color) => {
    const numPoints = 100; // Количество точек
    const background = document.getElementById('background');

    for (let i = 0; i < numPoints; i++) {
        const point = document.createElement('div');
        point.className = 'point';
        point.style.width = `${Math.random() * 5 + 2}px`;
        point.style.height = point.style.width;
        point.style.backgroundColor = color; // Устанавливаем цвет точек
        point.style.left = `${Math.random() * 100}vw`;
        point.style.top = `${Math.random() * 100}vh`;
        point.style.animationDuration = `${Math.random() * 10 + 5}s`; // Случайная скорость анимации
        background.appendChild(point);
    }
};

// Функция для переключения размытия
const toggleBlur = () => {
    const menu = document.getElementById('menu');
    menu.style.backdropFilter = menu.style.backdropFilter ? '' : 'blur(10px)';
};

// Функция для переключения темы
const toggleTheme = () => {
    document.body.classList.toggle('light-theme');
    const themeButton = document.getElementById('themeButton');
    themeButton.textContent = themeButton.textContent === '☀️' ? '🌙' : '☀️';

    // Меняем цвет точек в зависимости от темы
    const points = document.querySelectorAll('.point');
    points.forEach(point => {
        point.style.backgroundColor = document.body.classList.contains('light-theme') ? 'black' : 'white';
    });

    // Меняем цвет текста в меню
    const menu = document.getElementById('menu');
    menu.style.color = document.body.classList.contains('light-theme') ? 'black' : 'white';
};

// Создаем фон при загрузке страницы
window.onload = () => {
    createPoints('white'); // Создаем белые точки при загрузке
};

function startGame(gameFile) {
    window.location.href = gameFile; // Перенаправляем на выбранный файл игры
}
