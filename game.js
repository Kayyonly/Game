const themes = {
    magic: ['🌙', '⭐', '☀️', '🌍', '⚡', '🔮', '🎭', '🎪', '🎯', '🎲'],
    animals: ['🐶', '🐱', '🐼', '🦊', '🐨', '🦁', '🐯', '🦒', '🦈', '🦘'],
    food: ['🍕', '🍔', '🌮', '🍣', '🍜', '🍪', '🍩', '🍎', '🍇', '🥑']
};

let selectedTheme = '';
let currentLevel = 1;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = false;
let timer;
let seconds = 0;


document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedTheme = card.dataset.theme;
        document.getElementById('startButton').disabled = false;
    });
});


document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('menuScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    startGame();
});


document.getElementById('nextLevelBtn').addEventListener('click', () => {
    document.getElementById('levelComplete').style.display = 'none';
    currentLevel++;
    startGame();
});

function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(symbol, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-front">?</div>
        <div class="card-back">${symbol}</div>
    `;
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.addEventListener('click', () => flipCard(card));
    return card;
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('flip') || 
        card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flip');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.symbol === card2.dataset.symbol;

    if (match) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        document.getElementById('pairs').textContent = matchedPairs;

        if (matchedPairs === currentLevel + 2) {
            clearInterval(timer);
            setTimeout(showLevelComplete, 500);
        }
    } else {
        canFlip = false;
        setTimeout(() => {
            card1.classList.remove('flip');
            card2.classList.remove('flip');
            canFlip = true;
        }, 1000);
    }

    flippedCards = [];
}

function showLevelComplete() {
    document.getElementById('levelMoves').textContent = moves;
    document.getElementById('levelComplete').style.display = 'block';
}

function startGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    document.getElementById('moves').textContent = '0';
    document.getElementById('pairs').textContent = '0';
    document.getElementById('currentLevel').textContent = currentLevel;
      /*versi Pake Sc Error? Join Saja Disini banyak template we https://whatsapp.com/channel/0029VanrndJICVfcrjFr3x2R */
    const numPairs = currentLevel + 2;
    document.getElementById('totalPairs').textContent = numPairs;

    const levelSymbols = themes[selectedTheme].slice(0, numPairs);
    cards = [...levelSymbols, ...levelSymbols];
    const shuffledCards = shuffleArray(cards);


    shuffledCards.forEach((symbol, index) => {
        const card = createCard(symbol, index);
        card.classList.add('flip');
        gameBoard.appendChild(card);
    });
/*versi Pake Sc Error? Join Saja Disini banyak template we https://whatsapp.com/channel/0029VanrndJICVfcrjFr3x2R */
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('flip');
        });
        canFlip = true;


        clearInterval(timer);
        timer = setInterval(updateTimer, 1000);
    }, 2000);
}
