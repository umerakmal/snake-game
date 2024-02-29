document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("game-board");
    const box = document.querySelector(".box");
    const gridSize = 20;

    let snake = [{ x: 0, y: 0 }];
    let food = generateFood();

    let direction = "right";
    let score = 0;
    let gameInterval;
    let ateFood = false;

    const body = document.querySelector("body");
    const p = document.querySelector("p");
    const btn = document.createElement("button");
    btn.classList.add("btn");

    let foodsEaten = 0;
    const speedIncreaseThreshold = 10;
    let initialGameInterval = 150;
    let currentGameInterval = initialGameInterval;

    function update() {
        moveSnake();
        checkCollision();
        checkFood();
        render();

        // Increase speed after every 10 foods
        if (ateFood) {
            foodsEaten++;
            if (foodsEaten % speedIncreaseThreshold === 0) {
                currentGameInterval -= 10; 
                clearInterval(gameInterval);
                gameInterval = setInterval(update, currentGameInterval);
            }
        }
    }

    function render() {
        board.innerHTML = "";
        renderSnake();
        renderFood();
    }

    function renderSnake() {
        snake.forEach((segment) => {
            const snakeSegment = document.createElement("div");
            snakeSegment.className = "snake";
            snakeSegment.style.left = segment.x * gridSize + "px";
            snakeSegment.style.top = segment.y * gridSize + "px";
            board.appendChild(snakeSegment);
        });
    }

    function renderFood() {
        const foodElement = document.createElement("div");
        foodElement.className = "food";
        foodElement.style.left = food.x * gridSize + "px";
        foodElement.style.top = food.y * gridSize + "px";
        board.appendChild(foodElement);
    }

    function moveSnake() {
        const head = { ...snake[0] };

        switch (direction) {
            case "up":
                head.y -= 1;
                break;
            case "down":
                head.y += 1;
                break;
            case "left":
                head.x -= 1;
                break;
            case "right":
                head.x += 1;
                break;
        }

        snake.unshift(head);
        if (!ateFood) {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];

        if (
            head.x < 0 ||
            head.y < 0 ||
            head.x >= board.clientWidth / gridSize ||
            head.y >= board.clientHeight / gridSize ||
            checkSelfCollision()
        ) {
            endGame();
        }
    }

    function checkSelfCollision() {
        const head = snake[0];
        return snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
    }

    function checkFood() {
        const head = snake[0];

        if (head.x === food.x && head.y === food.y) {
            food = generateFood();
            ateFood = true;
            score += 5;
        } else {
            ateFood = false;
        }
    }

    function generateFood() {
        const x = Math.floor(Math.random() * (board.clientWidth / gridSize));
        const y = Math.floor(Math.random() * (board.clientHeight / gridSize));
        return { x, y };
    }

    function endGame() {
        board.classList.add("b-red");
        box.classList.add("b-red");
        p.innerText = `Game Over! Your Score: ${score}`;
        body.appendChild(btn);
        btn.innerText = "Play again";
        btn.addEventListener("click", startGame);
        clearInterval(gameInterval);
    }

    function startGame() {
        board.classList.remove("b-red");
        box.classList.remove("b-red");
        p.innerText = ""; 
        btn.remove();
        snake = [{ x: 0, y: 0 }];
        food = generateFood();
        direction = "right";
        score = 0;
        ateFood = false;
        foodsEaten = 0;
        currentGameInterval = initialGameInterval;
        gameInterval = setInterval(update, currentGameInterval);
    }

    function handleSwipe() {
        const swipeThreshold = 30;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 0) {
                    // Swipe right
                    direction = "right";
                } else {
                    // Swipe left
                    direction = "left";
                }
            } else {
                // Vertical swipe
                if (deltaY > 0) {
                    // Swipe down
                    direction = "down";
                } else {
                    // Swipe up
                    direction = "up";
                }
            }
        }
    }

    let touchStartX, touchStartY, touchEndX, touchEndY;

    document.addEventListener("touchstart", function (event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    });

    document.addEventListener("touchmove", function (event) {
        touchEndX = event.touches[0].clientX;
        touchEndY = event.touches[0].clientY;
    });

    document.addEventListener("touchend", function () {
        handleSwipe();
    });

    document.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowUp":
                if (direction !== "down") direction = "up";
                break;
            case "ArrowDown":
                if (direction !== "up") direction = "down";
                break;
            case "ArrowLeft":
                if (direction !== "right") direction = "left";
                break;
            case "ArrowRight":
                if (direction !== "left") direction = "right";
                break;
        }
    });

    startGame();
});
