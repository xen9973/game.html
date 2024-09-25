const bird = document.getElementById('bird');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const themeToggle = document.getElementById('theme-toggle');
const leaderboard = document.getElementById('leaderboard');
const scoresList = document.getElementById('scores-list');

let birdY = 300;
let gravity = 2;
let jumpHeight = 50;
let score = 0;
let isGameOver = false;
let pipes = [];
const pipeWidth = 60;
const gap = 150;
let scores = [];

function jump() {
    if (isGameOver) return;
    birdY -= jumpHeight;
    if (birdY < 0) birdY = 0; // Ограничение сверху
    bird.style.top = birdY + 'px';
}

function createPipes() {
    const pipeHeight = Math.floor(Math.random() * (400 - gap)) + 50;
    const topPipe = createSinglePipe(pipeHeight);
    const bottomPipeHeight = 700 - pipeHeight - gap;
    const bottomPipe = createSinglePipe(bottomPipeHeight, true);

    pipes.push({ top: topPipe, bottom: bottomPipe });
    movePipe(topPipe, bottomPipe);
}

function createSinglePipe(height, isBottom = false) {
    const pipe = document.createElement('div');
    pipe.classList.add('pipe');
    pipe.style.height = height + 'px';
    pipe.style.left = '400px';
    if (isBottom) {
        pipe.style.bottom = '0';
    }
    document.querySelector('.game-container').appendChild(pipe);
    return pipe;
}

function movePipe(pipe, pipeBottom) {
    const moveInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(moveInterval);
            return;
        }

        const pipeLeft = parseInt(pipe.style.left);
        pipe.style.left = pipeLeft - 5 + 'px';
        pipeBottom.style.left = pipeLeft - 5 + 'px';

        if (pipeLeft < -pipeWidth) {
            pipe.remove();
            pipeBottom.remove();
            clearInterval(moveInterval);
            pipes.shift();
            score++;
            scoreDisplay.innerText = score;
        }

        if (checkCollision(pipe, pipeBottom)) {
            gameOver();
            clearInterval(moveInterval);
        }
    }, 20);
}

function checkCollision(pipe, pipeBottom) {
    const pipeRect = pipe.getBoundingClientRect();
    const pipeBottomRect = pipeBottom.getBoundingClientRect();
    const birdRect = bird.getBoundingClientRect();

    const collidedWithTopPipe = (
        birdRect.left < pipeRect.right &&
        birdRect.right > pipeRect.left &&
        birdRect.top < pipeRect.bottom
    );

    const collidedWithBottomPipe = (
        birdRect.left < pipeBottomRect.right &&
        birdRect.right > pipeBottomRect.left &&
        birdRect.bottom > pipeBottomRect.top
    );

    // Проверка на то, находится ли птица в пределах отверстия
    const isInGap = (
        birdRect.bottom < pipeRect.bottom &&
        birdRect.top > pipeBottomRect.top
    );

    // Возвращаем true, если произошло столкновение с трубами и птица не в отверстии
    return (collidedWithTopPipe || collidedWithBottomPipe) && !isInGap;
}


function gameOver() {
    isGameOver = true;
    gameOverDisplay.classList.remove('hidden');
    updateLeaderboard();
}

function updateLeaderboard() {
    scores.push(score);
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 5);
    scoresList.innerHTML = scores.map(s => `<li>${s}</li>`).join('');
    leaderboard.classList.remove('hidden');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') {
        jump();
    }
    if (e.code === 'ArrowDown') {
        birdY += jumpHeight; // Позволяем птице опускаться
        if (birdY > 650 - 50) birdY = 650 - 50; // Ограничение снизу
        bird.style.top = birdY + 'px';
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        birdY += gravity;
        if (birdY > 650 - 50) {
            birdY = 650 - 50; // Ограничение снизу
            gameOver();
        }
        bird.style.top = birdY + 'px';
    }
});

setInterval(() => {
    if (!isGameOver) {
        birdY += gravity;
        if (birdY > 650 - 50) {
            birdY = 650 - 50;
            gameOver();
        }
        bird.style.top = birdY + 'px';
    }
}, 20);

setInterval(createPipes, 2000);
