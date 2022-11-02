const holes = document.getElementsByClassName("hole");
const scoreElement = document.getElementById("score");
const lifeElement = document.getElementById("life");
const gameStart = document.getElementById("start-screen");
const gameOver = document.getElementById("end-screen");
const leftArea = document.getElementById("left");
const holesArea = document.getElementById("holes-area");
const rightArea = document.getElementById("right");
const speeds = document.getElementById("speeds");

let isMoleInHole = [false, false, false, false, false, false, false, false, false];
let score = 0;
let life = 5;

let waitTime = 2000;
let moleSpawnTimer;
let upTime = 750;

function Slow() {
    upTime = 1000;
    waitTime = 2000;
}

function Medium() {
    upTime = 750;
    waitTime = 2000;
}

function Fast() {
    upTime = 500;
    waitTime = 1000;
}

function ClickedHole(idx) {
    if (isMoleInHole[idx])
    {
        HideMole(idx);
        score++;
        scoreElement.innerHTML = score;
    }
    else
    {
        if (life == 1)
        {
            GameOver();
        }
        life--;
        lifeElement.innerHTML = life;
    }
}

function ShowMole(idx) {
    const hole = holes[idx];

    if (!hole.classList.contains("show-mole"))
    {
        hole.classList.add("show-mole");
    }

    isMoleInHole[idx] = true;

    setTimeout(function() {
        HideMole(idx);
    }, upTime);
}

function HideMole(idx) {
    const hole = holes[idx];

    if (hole.classList.contains("show-mole"))
    {
        hole.classList.remove("show-mole");
    }

    isMoleInHole[idx] = false;
}

function showRandomMole() {
    let idx = getRndInteger(0, 9);

    ShowMole(idx);

    moleSpawnTimer = setTimeout(showRandomMole, waitTime);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function ShowElement(element) {
    if (element.classList.contains("d-none"))
    {
        element.classList.remove("d-none");
    }
}

function HideElement(element) {
    if (!element.classList.contains("d-none"))
    {
        element.classList.add("d-none");
    }
}

function StartGame() {
    HideElement(gameStart);
    ShowElement(leftArea);
    ShowElement(holesArea);
    ShowElement(rightArea);
    ShowElement(speeds);

    score = 0;
    scoreElement.innerHTML = score;
    life = 5;
    lifeElement.innerHTML = life;

    showRandomMole();
    Medium();
}

function GameOver() {
    ShowElement(gameOver);
    HideElement(leftArea);
    HideElement(holesArea);
    HideElement(rightArea);
    HideElement(speeds);

    clearTimeout(moleSpawnTimer);
}

function RestartGame() {
    HideElement(gameOver);
    StartGame();
}