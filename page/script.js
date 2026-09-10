const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const gameContainer = document.querySelector(".game-container");
let gameStarted = false;
let gameOver = false;
let dinoIsJumping = false;
let dinoRunInterval;
let cactusImageInterval;
let checkCollision;

function alternateCactusImages() {
    const cactusImages = [
        'url("images/cactus_1.png")',
        'url("images/cactus_2.png")',
        'url("images/cactus_3.png")'
    ];
    let currentCactusImage = 0;

    cactus.style.backgroundImage = cactusImages[currentCactusImage];
    cactusImageInterval = setInterval(() => {
        currentCactusImage = (currentCactusImage + 1) % cactusImages.length;
        cactus.style.backgroundImage = cactusImages[currentCactusImage];
    }, 1500);
}

function alternateDinoImages() {
    let isFirstRunImage = true;

    dinoRunInterval = setInterval(() => {
        if (dinoIsJumping) {
            return;
        }

        dino.style.backgroundImage = isFirstRunImage
            ? 'url("images/dino_run1.png")'
            : 'url("images/dino_run2.png")';
        isFirstRunImage = !isFirstRunImage;
    }, 150);
}

function startCollisionCheck() {
    checkCollision = setInterval(() => {
        if (!gameStarted) {
            return;
        }

        let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
        let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

        // Verifica se o cacto está na posição do dinossauro e se o dino está no chão
        if (cactusLeft > 40 && cactusLeft < 80 && dinoBottom < 40) {
            gameStarted = false;
            gameOver = true;
            clearInterval(dinoRunInterval);
            dino.style.backgroundImage = 'url("images/standing_still_eye_closed.png")';
            cactus.style.animation = "none";
            cactus.style.left = cactusLeft + "px";
            clearInterval(cactusImageInterval);
            gameContainer.classList.remove("started");
            gameContainer.classList.add("game-over");
            clearInterval(checkCollision);
        }
    }, 10);
}

function startGame() {
    gameStarted = true;
    gameOver = false;
    gameContainer.classList.remove("game-over");
    gameContainer.classList.add("started");
    alternateDinoImages();
    alternateCactusImages();
    startCollisionCheck();
}

function resetGame() {
    clearInterval(dinoRunInterval);
    clearInterval(cactusImageInterval);
    dinoIsJumping = false;
    dino.classList.remove("jump");
    dino.style.backgroundImage = 'url("images/standing_still.png")';
    cactus.style.backgroundImage = 'url("images/cactus_1.png")';
    cactus.style.animation = "";
    cactus.style.left = "600px";
}

function jump() {
    if (!dino.classList.contains("jump")) {
        dinoIsJumping = true;
        dino.style.backgroundImage = 'url("images/standing_still_eye_closed.png")';
        dino.classList.add("jump");
        setTimeout(() => {
            dino.classList.remove("jump");
            dinoIsJumping = false;
            dino.style.backgroundImage = 'url("images/dino_run1.png")';
        }, 500);
    }
}

document.addEventListener("keydown", function (event) {
    if (event.code === "Space" || event.key === " ") {
        event.preventDefault();

        if (gameOver) {
            resetGame();
            startGame();
            return;
        }

        if (!gameStarted) {
            startGame();
            return;
        }

        jump();
    }
});

