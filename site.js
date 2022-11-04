const holes = document.getElementsByClassName("hole");
const scoreElement = document.getElementById("score");
const lifeElement = document.getElementById("life");
const gameStart = document.getElementById("start-screen");
const gameOver = document.getElementById("end-screen");
const leftArea = document.getElementById("left");
const holesArea = document.getElementById("holes-area");
const rightArea = document.getElementById("right");
const bgArea = document.getElementById("background");
const speeds = document.getElementById("speeds");
const slowMode = document.getElementById("slow");
const mediumMode = document.getElementById("medium");
const fastMode = document.getElementById("fast");
const hardModeSelector = document.getElementById("hard-mode");

let isMoleInHole = [false, false, false, false, false, false, false, false, false];
let isGoldenMoleInHole = [false, false, false, false, false, false, false, false, false];
let isBombInHole = [false, false, false, false, false, false, false, false, false];
let score = 0;
let life = 5;

let waitTime = 2000;
let moleSpawnTimer;
let upTime = 750;

let molesTillGolden = getRndInteger(10, 20);

let hardMode = false;
let molesTillBomb = getRndInteger(4, 8);

let currentBackgroundFrame = 1;

function Slow() {
    upTime = 1000;
    waitTime = 2000;
    hardMode = false;

    score = 0;
    scoreElement.innerHTML = score;

    slowMode.classList.add("selected-mode");
    mediumMode.classList.remove("selected-mode");
    fastMode.classList.remove("selected-mode");
    hardModeSelector.classList.remove("selected-mode");
}

function Medium() {
    upTime = 750;
    waitTime = 2000;
    hardMode = false;

    score = 0;
    scoreElement.innerHTML = score;

    slowMode.classList.remove("selected-mode");
    mediumMode.classList.add("selected-mode");
    fastMode.classList.remove("selected-mode");
    hardModeSelector.classList.remove("selected-mode");
}

function Fast() {
    upTime = 500;
    waitTime = 1000;
    hardMode = false;

    score = 0;
    scoreElement.innerHTML = score;

    slowMode.classList.remove("selected-mode");
    mediumMode.classList.remove("selected-mode");
    fastMode.classList.add("selected-mode");
    hardModeSelector.classList.remove("selected-mode");
}

function ClickedHole(idx) {
    if (isMoleInHole[idx])
    {
        if (isGoldenMoleInHole[idx])
        {
            score += 5;
        }
        else
        {
            score++;
        }
        scoreElement.innerHTML = score;
        HideMole(idx);
    }
    else
    {
        if (isBombInHole[idx])
        {
            life -= 2;
        }
        else
        {
            life--;
        }

        if (life <= 0)
        {
            GameOver();
        }

        lifeElement.innerHTML = life;
    }
}

function ShowMole(idx) {
    const hole = holes[idx];

    if (molesTillGolden <= 0)
    {
        hole.classList.remove("mole");
        hole.classList.remove("bomb");
        hole.classList.add("golden-mole");

        molesTillGolden = (hardMode) ? getRndInteger(15,25) : getRndInteger(10, 20);

        isGoldenMoleInHole[idx] = true;
        isMoleInHole[idx] = true;

        if (hardMode)
        {
            molesTillBomb--
        }
    }
    else
    {
        if (hardMode && molesTillBomb <= 0)
        {
            hole.classList.remove("golden-mole");
            hole.classList.remove("mole");
            hole.classList.add("bomb");

            molesTillBomb = getRndInteger(4,8);

            isBombInHole[idx] = true;
        }
        else
        {
            hole.classList.remove("golden-mole");
            hole.classList.remove("bomb");
            hole.classList.add("mole");

            if (hardMode)
            {
                molesTillBomb--
            }

            isMoleInHole[idx] = true;
        }
        
        molesTillGolden--;
    }    

    setTimeout(function() {
        HideMole(idx);
    }, (hardMode) ? getRndInteger(400,900) : upTime);
}

function HideMole(idx) {
    const hole = holes[idx];

    hole.classList.remove("golden-mole");
    hole.classList.remove("mole");
    hole.classList.remove("bomb");

    isMoleInHole[idx] = false;
    isGoldenMoleInHole[idx] = false;
    isBombInHole[idx] = false;
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

function HardMode() {
    Fast();

    hardMode = true;

    score = 0;
    scoreElement.innerHTML = score;

    slowMode.classList.remove("selected-mode");
    mediumMode.classList.remove("selected-mode");
    fastMode.classList.remove("selected-mode");
    hardModeSelector.classList.add("selected-mode");
}

function AnimateBackground() {
    switch (currentBackgroundFrame)
    {
        case 1:
            // set first frame
            bgArea.classList.remove("background-frame2");
            bgArea.classList.remove("background-frame3");
            bgArea.classList.remove("background-frame4");
            bgArea.classList.add("background-frame1");
            currentBackgroundFrame = 2;
            break;
        case 2:
            // set second frame
            bgArea.classList.remove("background-frame1");
            bgArea.classList.remove("background-frame3");
            bgArea.classList.remove("background-frame4");
            bgArea.classList.add("background-frame2");
            currentBackgroundFrame = 3;
            break;
        case 3:
            // set third frame
            bgArea.classList.remove("background-frame1");
            bgArea.classList.remove("background-frame2");
            bgArea.classList.remove("background-frame4");
            bgArea.classList.add("background-frame3");
            currentBackgroundFrame = 4;
            break;
        case 4:
            // set fourth frame
            bgArea.classList.remove("background-frame1");
            bgArea.classList.remove("background-frame2");
            bgArea.classList.remove("background-frame3");
            bgArea.classList.add("background-frame4");
            currentBackgroundFrame = 1;
            break;
        default:
            currentBackgroundFrame = 1;
    }
}

setInterval(AnimateBackground, 1000);