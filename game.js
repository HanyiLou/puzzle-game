const puzzleContainer = document.getElementById('puzzle-container');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const currentScoreEl = document.getElementById('current-score');
const totalScoreEl = document.getElementById('total-score');
const picturesFolder = 'pictures/'; // 图片文件夹路径
const picturesCount = 10; // 图片数量
let pieces = [];
let currentScore = 0;
let totalScore = 0;
let isGameStarted = false;
let computerSpeed = 1000; // 电脑拼图速度（毫秒）
let computerPieces = 2; // 电脑分配的拼图片数
let humanPieces = 7; // 被试分配的拼图片数
let roundLimit = picturesCount; // 总轮次数，与图片数量一致
let roundCount = 0;
let usedPictures = []; // 已使用的图片索引

// 获取随机图片路径
function getRandomImageSrc() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * picturesCount);
    } while (usedPictures.includes(randomIndex)); // 确保不重复使用图片
    usedPictures.push(randomIndex); // 记录已使用的图片索引
    return `${picturesFolder}puzzle${randomIndex + 1}.jpg`; // 返回图片路径
}

// 初始化拼图
function createPuzzle(imageSrc, rows, cols) {
    puzzleContainer.innerHTML = '';
    const pieceWidth = puzzleContainer.clientWidth / cols;
    const pieceHeight = puzzleContainer.clientHeight / rows;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.style.width = `${pieceWidth}px`;
            piece.style.height = `${pieceHeight}px`;
            piece.style.backgroundImage = `url(${imageSrc})`;
            piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;
            piece.style.position = 'absolute';
            piece.style.top = `${row * pieceHeight}px`;
            piece.style.left = `${col * pieceWidth}px`;
            piece.dataset.row = row;
            piece.dataset.col = col;
            piece.dataset.correctTop = `${row * pieceHeight}`;
            piece.dataset.correctLeft = `${col * pieceWidth}`;
            piece.dataset.isHuman = col < humanPieces;
            pieces.push(piece);
            puzzleContainer.appendChild(piece);
        }
    }
    shufflePuzzle(rows, cols);
}

// 打乱拼图
function shufflePuzzle(rows, cols) {
    const positions = [];
    pieces.forEach(piece => {
        positions.push({ top: piece.style.top, left: piece.style.left });
    });
    pieces.forEach(piece => {
        const randomIndex = Math.floor(Math.random() * positions.length);
        const { top, left } = positions.splice(randomIndex, 1)[0];
        piece.style.top = top;
        piece.style.left = left;
    });
}

// 检查拼图是否完成
function checkPuzzleCompletion() {
    let completed = true;
    pieces.forEach(piece => {
        const currentTop = parseInt(piece.style.top);
        const currentLeft = parseInt(piece.style.left);
        if (currentTop !== parseInt(piece.dataset.correctTop) || currentLeft !== parseInt(piece.dataset.correctLeft)) {
            completed = false;
        }
    });
    if (completed) {
        const timeTaken = Date.now() - startTime;
        if (timeTaken <= 300000) { // 5分钟内完成
            const bonus = Math.max(0, 20 - (timeTaken / 1000));
            currentScore += bonus;
            totalScore += bonus;
            currentScoreEl.textContent = currentScore;
            totalScoreEl.textContent = totalScore;
            alert(`本轮完成！你获得了${bonus}分`);
        } else {
            alert('本轮未在规定时间内完成');
        }
        roundCount++;
        if (roundCount < roundLimit) {
            startGame();
        } else {
            alert(`游戏结束！你的总得分是${totalScore}`);
            usedPictures = []; // 重置已使用的图片索引
        }
    }
}

// 电脑自动拼图
function computerMove() {
    const computerPieces = pieces.filter(piece => !piece.dataset.isHuman);
    computerPieces.forEach(piece => {
        if (Math.random() < 0.5) { // 电脑随机移动
            const targetIndex = Math.floor(Math.random() * computerPieces.length);
            const targetPiece = computerPieces[targetIndex];
            const tempTop = piece.style.top;
            const tempLeft = piece.style.left;
            piece.style.top = targetPiece.style.top;
            piece.style.left = targetPiece.style.left;
            targetPiece.style.top = tempTop;
            targetPiece.style.left = tempLeft;
        }
    });
    checkPuzzleCompletion();
}

// 开始游戏
function startGame() {
    const imageSrc = getRandomImageSrc(); // 获取随机图片路径
    createPuzzle(imageSrc, rows, cols);
    currentScore = 0;
    currentScoreEl.textContent = currentScore;
    isGameStarted = true;
    startTime = Date.now();
    setInterval(computerMove, computerSpeed); // 电脑定时移动
}

// 重置游戏
function resetGame() {
    roundCount = 0;
    totalScore = 0;
    totalScoreEl.textContent = totalScore;
    usedPictures = []; // 重置已使用的图片索引
    startGame();
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);