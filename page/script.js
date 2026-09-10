const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const gameContainer = document.querySelector(".game-container");
let gameStarted = false;
let gameOver = false;
let dinoIsJumping = false;
let dinoRunInterval;
let cactusImageInterval;
let checkCollision;

// alterna as imagens dos cactos a cada 1,5 segundos para dar a impressão de movimento (3 imagens diferentes)
// o movimento de fato do cacto é feito via CSS (animação cactusMove)
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

// alterna as imagens do dinossauro a cada 150ms para dar a impressão de movimento (2 imagens diferentes)
function alternateDinoImages() {
    // controla qual imagem do dinossauro será exibida na próxima iteração
    let isFirstRunImage = true;

    // a cada intervalo de 150ms, alterna a imagem do dinossauro, desde que ele não esteja pulando
    dinoRunInterval = setInterval(() => {
        if (dinoIsJumping) {
            return;
        }
        
        // alteração é feita mudando a imagem de background do elemento (id) dino
        // a cada iteração, a variável isFirstRunImage é invertida para alternar entre as duas imagens
        // se isFirstRunImage for true, a imagem exibida será dino_run1.png, caso contrário, será dino_run2.png
        dino.style.backgroundImage = isFirstRunImage
            ? 'url("images/dino_run1.png")'
            : 'url("images/dino_run2.png")';
        isFirstRunImage = !isFirstRunImage;
    }, 150);
}

// detecta colisões entre o dinossauro e o cacto a cada 10ms
function startCollisionCheck() {
    checkCollision = setInterval(() => {
        if (!gameStarted) {
            return;
        }

        // representa a posição vertical do dinossauro (distância do chão)
        let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
        // representa a posição horizontal do cacto (distância da esquerda)
        let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

        // Verifica se o cacto está na APROXIMADAMENTE na posição do dinossauro (sempre fixa) e se o dino está no chão
        // a colisão é detectada quando o cacto está entre 40 e 80 pixels da esquerda
        // e a posição do dinossauro na vertical é menor que 40 pixels (ou seja, ele não está pulando)
        if (cactusLeft > 50 && cactusLeft < 80 && dinoBottom < 40) {
            gameStarted = false; // jogo encerrado
            gameOver = true; 
            clearInterval(dinoRunInterval); // animação de corrida é interrompida
            dino.style.backgroundImage = 'url("images/standing_still_eye_closed.png")'; // imagem de derrota do dino
            cactus.style.animation = "none"; // os cactos param de se mover
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
    gameContainer.classList.add("started"); // inicia a animação do cacto via CSS
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
    cactus.style.animation = ""; // reinicia a animação do cacto
    cactus.style.left = "600px";
}

// Função para fazer o dinossauro pular
function jump() {
    // o salto só é permitido se o dinossauro não estiver pulando no momento (não contém a classe "jump")
    if (!dino.classList.contains("jump")) {
        dinoIsJumping = true;
        dino.style.backgroundImage = 'url("images/standing_still_eye_closed.png")'; // altera a imagem do dinossauro para a de salto via CSS
        
        // adiciona a classe "jump" ao dinossauro. 
        // .jump é uma classe CSS que define a animação de salto do dinossauro e aqui ela é adicionada ao elemento dino para iniciar a animação de salto
        // fica assim temporariamente: <div id="dino" class="jump"></div>
        dino.classList.add("jump"); 
        // define o tempo do salto para 500ms, após o qual a classe "jump" é removida do elemento e o dinossauro volta à posição inicial
        setTimeout(() => { 
            dino.classList.remove("jump");
            dinoIsJumping = false;
            dino.style.backgroundImage = 'url("images/dino_run1.png")';
        }, 500);
    }
}

// Adiciona um listener de evento para detectar quando a tecla de espaço é pressionada
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

