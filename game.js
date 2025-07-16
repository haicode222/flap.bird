document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử DOM
    const bird = document.getElementById('bird');
    const gameContainer = document.getElementById('game-container');
    const obstacles = document.getElementById('obstacles');
    const scoreElement = document.getElementById('score');
    const gameOverElement = document.getElementById('game-over');
    const restartButton = document.getElementById('restart-button');
    const finalScoreElement = document.getElementById('final-score');

    // Biến game
    let birdPosition;
    let gravity;
    let gameSpeed;
    let score;
    let isGameOver;
    let isGameStarted;
    let pipeGap;
    let pipeInterval;
    let gameLoop;

    // Khởi tạo game
    function initGame() {
        birdPosition = gameContainer.offsetHeight / 2;
        gravity = 0;
        gameSpeed = 2;
        score = 0;
        isGameOver = false;
        isGameStarted = true; // Bắt đầu game ngay lập tức
        pipeGap = 150;

        // Reset hiển thị
        bird.style.top = birdPosition + 'px';
        scoreElement.textContent = score;
        gameOverElement.style.display = 'none';
        
        // Xóa tất cả ống cũ
        obstacles.innerHTML = '';
        
        // Bắt đầu game ngay
        startGamePlay();
    }

    // Hàm nhảy
    function jump() {
        if (!isGameStarted || isGameOver) return;
        gravity = -8;
    }

    // Bắt đầu chơi
    function startGamePlay() {
        isGameStarted = true;
        isGameOver = false;
        birdPosition = gameContainer.offsetHeight / 2;
        gravity = 0;
        bird.style.top = birdPosition + 'px';

        // Bắt đầu tạo ống
        pipeInterval = setInterval(createPipe, 3000);

        // Game loop
        gameLoop = setInterval(() => {
            if (isGameOver) return;

            // Cập nhật vị trí chim
            gravity += 0.4;
            birdPosition += gravity;
            bird.style.top = birdPosition + 'px';

            // Kiểm tra va chạm
            checkCollisions();
            updatePipes();
        }, 20);
    }

    // Tạo ống mới
    function createPipe() {
        if (isGameOver) return;

        const minHeight = 50;
        const maxHeight = gameContainer.offsetHeight - pipeGap - minHeight - 20;
        const pipeHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

        // Tạo ống trên
        const upperPipe = document.createElement('div');
        upperPipe.className = 'pipe upper-pipe';
        upperPipe.style.height = `${pipeHeight}px`;
        upperPipe.style.right = '0px';
        obstacles.appendChild(upperPipe);

        // Tạo ống dưới
        const lowerPipe = document.createElement('div');
        lowerPipe.className = 'pipe lower-pipe';
        lowerPipe.style.height = `${gameContainer.offsetHeight - pipeHeight - pipeGap - 20}px`;
        lowerPipe.style.right = '0px';
        obstacles.appendChild(lowerPipe);
    }

    // Cập nhật ống
    function updatePipes() {
        const pipes = document.querySelectorAll('.pipe');
        pipes.forEach(pipe => {
            const currentRight = parseInt(pipe.style.right) || 0;
            pipe.style.right = `${currentRight + gameSpeed}px`;

            // Tăng điểm khi vượt qua ống
            if (currentRight === gameContainer.offsetWidth / 2) {
                score++;
                scoreElement.textContent = score;
            }

            // Xóa ống khi ra khỏi màn hình
            if (currentRight > gameContainer.offsetWidth) {
                pipe.remove();
            }
        });
    }

    // Kiểm tra va chạm
    function checkCollisions() {
        // Va chạm với đất hoặc trần
        if (birdPosition >= gameContainer.offsetHeight - bird.offsetHeight - 20 || 
            birdPosition <= 0) {
            endGame();
            return;
        }

        // Va chạm với ống
        const birdRect = bird.getBoundingClientRect();
        const pipes = document.querySelectorAll('.pipe');
        
        pipes.forEach(pipe => {
            const pipeRect = pipe.getBoundingClientRect();
            
            if (birdRect.right > pipeRect.left && 
                birdRect.left < pipeRect.right && 
                birdRect.bottom > pipeRect.top && 
                birdRect.top < pipeRect.bottom) {
                endGame();
            }
        });
    }

    // Kết thúc game
    function endGame() {
        isGameOver = true;
        isGameStarted = false;
        clearInterval(pipeInterval);
        clearInterval(gameLoop);
        
        finalScoreElement.textContent = score;
        gameOverElement.style.display = 'block';
    }

    // Sự kiện nút chơi lại
    restartButton.addEventListener('click', () => {
        initGame();
    });

    // Điều khiển
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') jump();
    });
    gameContainer.addEventListener('click', jump);
    gameContainer.addEventListener('touchstart', (e) => {
        e.preventDefault();
        jump();
    });

    // Khởi tạo game lần đầu
    initGame();
});