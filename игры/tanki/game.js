const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tank = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 40,
    height: 20,
    speed: 5,
    direction: 0,
    turretLength: 40,
    turretWidth: 5,
    health: 100 // Здоровье игрока
};

let bullets = [];
const bulletSpeed = 10;
let score = 0;
let level = 1;
const bots = [];
const botCount = 3;
const obstacles = [];
const botBullets = [];

for (let i = 0; i < 5; i++) {
    obstacles.push({
        x: Math.random() * (canvas.width - 50) + 25,
        y: Math.random() * (canvas.height - 50) + 25,
        width: 50,
        height: 50,
        destroyed: false
    });
}

function drawTank() {
    ctx.save();
    ctx.translate(tank.x, tank.y);
    ctx.rotate(tank.direction);
    
    ctx.fillStyle = 'green';
    ctx.fillRect(-tank.width / 2, -tank.height / 2, tank.width, tank.height); 
    
    ctx.restore();
}

function drawHealthBar() {
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 200, 20); // Фоновый цвет

    ctx.fillStyle = 'lime';
    ctx.fillRect(10, 10, (tank.health / 100) * 200, 20); // Индикатор здоровья
}

function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawBots() {
    ctx.fillStyle = 'blue';
    bots.forEach(bot => {
        ctx.save();
        ctx.translate(bot.x, bot.y);
        ctx.rotate(bot.direction);
        ctx.fillRect(-tank.width / 2, -tank.height / 2, tank.width, tank.height);
        ctx.restore();
    });
}

function drawBotBullets() {
    ctx.fillStyle = 'orange';
    botBullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawObstacles() {
    ctx.fillStyle = 'brown';
    obstacles.forEach(obstacle => {
        if (!obstacle.destroyed) {
            ctx.fillRect(obstacle.x - obstacle.width / 2, obstacle.y - obstacle.height / 2, obstacle.width, obstacle.height);
        }
    });
}

function updateBullets() {
    bullets.forEach(bullet => {
        bullet.x += Math.cos(bullet.direction) * bulletSpeed;
        bullet.y += Math.sin(bullet.direction) * bulletSpeed;

        bots.forEach((bot, botIndex) => {
            if (bullet.x > bot.x - tank.width / 2 &&
                bullet.x < bot.x + tank.width / 2 &&
                bullet.y > bot.y - tank.height / 2 &&
                bullet.y < bot.y + tank.height / 2) {
                score += 20;
                bullets = bullets.filter(b => b !== bullet);
                bots.splice(botIndex, 1);
            }
        });

        obstacles.forEach(obstacle => {
            if (!obstacle.destroyed &&
                bullet.x > obstacle.x - obstacle.width / 2 &&
                bullet.x < obstacle.x + obstacle.width / 2 &&
                bullet.y > obstacle.y - obstacle.height / 2 &&
                bullet.y < obstacle.y + obstacle.height / 2) {
                obstacle.destroyed = true;
                score += 10;
            }
        });
    });

    bullets = bullets.filter(bullet => bullet.x > 0 && bullet.x < canvas.width && bullet.y > 0 && bullet.y < canvas.height);
}

function updateBotBullets() {
    botBullets.forEach((bullet, index) => {
        bullet.x += Math.cos(bullet.direction) * bulletSpeed;
        bullet.y += Math.sin(bullet.direction) * bulletSpeed;

        // Проверка на попадание в игрока
        if (bullet.x > tank.x - tank.width / 2 &&
            bullet.x < tank.x + tank.width / 2 &&
            bullet.y > tank.y - tank.height / 2 &&
            bullet.y < tank.y + tank.height / 2) {
            tank.health -= 20; // Уменьшаем здоровье игрока
            botBullets.splice(index, 1); // Удаляем пулю
            if (tank.health <= 0) {
                alert("Вы проиграли!");
                document.location.reload(); // Перезагружаем страницу при проигрыше
            }
        }
    });

    botBullets = botBullets.filter(bullet => bullet.x > 0 && bullet.x < canvas.width && bullet.y > 0 && bullet.y < canvas.height);
}

function createBots() {
    for (let i = 0; i < botCount; i++) {
        bots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            direction: Math.random() * Math.PI * 2,
            speed: 2
        });
    }
}

function updateBots() {
    bots.forEach(bot => {
        bot.x += Math.cos(bot.direction) * bot.speed;
        bot.y += Math.sin(bot.direction) * bot.speed;

        // Проверка на границы
        if (bot.x < tank.width / 2) {
            bot.x = tank.width / 2;
            bot.direction = Math.random() * Math.PI * 2; // Случайное направление
        }
        if (bot.x > canvas.width - tank.width / 2) {
            bot.x = canvas.width - tank.width / 2;
            bot.direction = Math.random() * Math.PI * 2; // Случайное направление
        }
        if (bot.y < tank.height / 2) {
            bot.y = tank.height / 2;
            bot.direction = Math.random() * Math.PI * 2; // Случайное направление
        }
        if (bot.y > canvas.height - tank.height / 2) {
            bot.y = canvas.height - tank.height / 2;
            bot.direction = Math.random() * Math.PI * 2; // Случайное направление
        }

        // Стрельба ботами (без прицеливания)
        if (Math.random() < 0.02) { // 2% шанс на стрельбу
            const randomDirection = Math.random() * Math.PI * 2; // Случайное направление
            botBullets.push({
                x: bot.x,
                y: bot.y,
                direction: randomDirection
            });
        }
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTank();
    drawHealthBar(); // Отображаем индикатор здоровья
    drawBullets();
    drawBots();
    drawBotBullets();
    drawObstacles();

    updateBullets();
    updateBots();
    updateBotBullets();

    if (score >= level * 50) {
        level++;
        createBots();
    }

    scoreboard.innerText = `Очки: ${score} | Уровень: ${level} | Здоровье: ${tank.health}`;
}

function handleKeyDown(event) {
    let newX = tank.x;
    let newY = tank.y;

    switch (event.key) {
        case 'ArrowUp':
            newX += Math.cos(tank.direction) * tank.speed;
            newY += Math.sin(tank.direction) * tank.speed;
            break;
        case 'ArrowDown':
            newX -= Math.cos(tank.direction) * tank.speed;
            newY -= Math.sin(tank.direction) * tank.speed;
            break;
    }

    if (newX - tank.width / 2 >= 0 && newX + tank.width / 2 <= canvas.width &&
        newY - tank.height / 2 >= 0 && newY + tank.height / 2 <= canvas.height) {
        tank.x = newX;
        tank.y = newY;
    }
}

function updateTurretDirection(mouseX, mouseY) {
    const deltaX = mouseX - tank.x;
    const deltaY = mouseY - tank.y;
    tank.direction = Math.atan2(deltaY, deltaX);
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    updateTurretDirection(mouseX, mouseY);
});

canvas.addEventListener('mousedown', (event) => {
    bullets.push({
        x: tank.x + Math.cos(tank.direction) * (tank.width / 2),
        y: tank.y + Math.sin(tank.direction) * (tank.height / 2),
        direction: tank.direction,
    });
});

document.addEventListener('keydown', handleKeyDown);
const scoreboard = document.getElementById('scoreboard');
createBots();
setInterval(update, 1000 / 60);
