const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [{ x: 10, y: 10 }];
let fruit = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let speed = 100;
let score = 0;
let gameInterval;

function setDifficulty(newSpeed) {
    speed = newSpeed;
    resetGame();
}

function resetGame() {
    clearInterval(gameInterval);
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    document.getElementById('score').innerText = score;
    placeFruit();
    gameInterval = setInterval(gameLoop, speed);
}

function placeFruit() {
    fruit.x = Math.floor(Math.random() * (canvas.width / 10));
    fruit.y = Math.floor(Math.random() * (canvas.height / 10));
}

function gameLoop() {
    updateSnake();
    if (checkCollision()) {
        endGame();
        return;
    }
    draw();
}

function updateSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    
    if (head.x === fruit.x && head.y === fruit.y) {
        score += 10;
        document.getElementById('score').innerText = score;
        placeFruit();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width / 10 || head.y < 0 || head.y >= canvas.height / 10) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем игровое поле в шахматном порядке
    for (let y = 0; y < canvas.height; y += 10) {
        for (let x = 0; x < canvas.width; x += 10) {
            ctx.fillStyle = (x / 10 + y / 10) % 2 === 0 ? '#B2FFB2' : '#A8D5BA'; // Цвета травы
            ctx.fillRect(x, y, 10, 10);
        }
    }
    
    ctx.fillStyle = "green";
    snake.forEach(part => {
        ctx.fillRect(part.x * 10, part.y * 10, 10, 10);
    });

    ctx.fillStyle = "red"; // Цвет фрукта
    ctx.beginPath();
    ctx.arc(fruit.x * 10 + 5, fruit.y * 10 + 5, 5, 0, Math.PI * 2);
    ctx.fill();
}

function endGame() {
    clearInterval(gameInterval);
    const nickname = document.getElementById('nickname').value;
    if (nickname) {
        saveScore(nickname);
    }
    alert("Игра окончена! Ваш счет: " + score);
    resetGame();
}

function saveScore(nickname) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ nickname, score });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 5)));
    displayLeaderboard();
}

function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';

    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `#${index + 1}: ${entry.nickname} - ${entry.score} очков`; // Исправлено
        leaderboardList.appendChild(listItem);
    });
}


document.getElementById('saveScoreBtn').addEventListener('click', () => {
    const nickname = document.getElementById('nickname').value;
    if (nickname) {
        saveScore(nickname);
        document.getElementById('nickname').value = '';
    } else {
        alert("Пожалуйста, введите никнейм!");
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && dy === 0) {
        dx = 0; dy = -1;
    } else if (event.key === 'ArrowDown' && dy === 0) {
        dx = 0; dy = 1;
    } else if (event.key === 'ArrowLeft' && dx === 0) {
        dx = -1; dy = 0;
    } else if (event.key === 'ArrowRight' && dx === 0) {
        dx = 1; dy = 0;
    }
});

// Дополнительный функционал для темной и светлой темы
let isDarkTheme = false;

function toggleTheme() {
    isDarkTheme = !isDarkTheme;

    // Плавно меняем фон
    document.body.style.background = isDarkTheme 
        ? 'linear-gradient(to bottom, #1a1a1a, #333)' // Тёмный градиент
        : 'linear-gradient(to bottom, #74ebd5, #ACB6E5)'; // Светлый градиент

    // Меняем цвет текста и кнопок
    document.querySelectorAll('.difficulty button, #themeButton').forEach(button => {
        button.style.backgroundColor = isDarkTheme ? '#555' : '#fff';
        button.style.color = isDarkTheme ? '#fff' : '#000';
    });

    document.querySelector('h1').style.color = isDarkTheme ? '#fff' : '#000'; // Меняем цвет заголовка

    // Меняем цвет текста таблицы лидеров
    const leaderboardItems = document.querySelectorAll('#leaderboardList li');
    leaderboardItems.forEach(item => {
        item.style.color = isDarkTheme ? '#fff' : '#000'; // Белый для темной темы, черный для светлой
    });

    // Меняем цвет заголовка таблицы лидеров
    const leaderboardHeader = document.querySelector('.leaderboard h2');
    leaderboardHeader.style.color = isDarkTheme ? '#fff' : '#000'; // Белый для темной темы, черный для светлой
}


// Вызовите displayLeaderboard() при загрузке страницы, чтобы отображать таблицу лидеров
document.addEventListener('DOMContentLoaded', displayLeaderboard);