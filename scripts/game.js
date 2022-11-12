// Getting the elements
//#region

const holes = document.getElementsByClassName("hole");
const scoreElement = document.getElementById("score");
const lifeElement = document.getElementById("life");
const gameStart = document.getElementById("start-screen");
const gameOver = document.getElementById("end-screen");
const leftArea = document.getElementById("left");
const holesArea = document.getElementById("holes-area");
const rightArea = document.getElementById("right");
const speeds = document.getElementById("speeds");
const slowMode = document.getElementById("slow");
const mediumMode = document.getElementById("medium");
const fastMode = document.getElementById("fast");
const hardModeSelector = document.getElementById("hard-mode");
const leaderboardLink = document.getElementById("leaderboard-link");
const nameInput = document.getElementById("name-input");


//#endregion

// Properties
//#region

let isMoleInHole = [false, false, false, false, false, false, false, false, false];
let isGoldenMoleInHole = [false, false, false, false, false, false, false, false, false];
let isBombInHole = [false, false, false, false, false, false, false, false, false];
let score = 0;
let life = 5;
let waitTime = 2000;
let moleSpawnTimer;
let moleHideTimer;
let upTime = 750;
let molesTillGolden = getRndInteger(10, 20);
let hardMode = false;
let molesTillBomb = getRndInteger(4, 8);
let started = false;
let selectedMode = "Medium";

//#endregion

// Game Modes
function Slow() {
    upTime = 1000;
    waitTime = 2000;
    hardMode = false;

    selectedMode = "Slow";

    life = 5;
    score = 0;
    scoreElement.innerHTML = score;
    lifeElement.innerHTML = life;

    slowMode.classList.add("selected-mode");
    mediumMode.classList.remove("selected-mode");
    fastMode.classList.remove("selected-mode");
    hardModeSelector.classList.remove("selected-mode");
}

function Medium() {
    upTime = 750;
    waitTime = 2000;
    hardMode = false;

    selectedMode = "Medium";

    life = 5;
    score = 0;
    scoreElement.innerHTML = score;
    lifeElement.innerHTML = life;

    slowMode.classList.remove("selected-mode");
    mediumMode.classList.add("selected-mode");
    fastMode.classList.remove("selected-mode");
    hardModeSelector.classList.remove("selected-mode");
}

function Fast() {
    upTime = 500;
    waitTime = 1000;
    hardMode = false;

    selectedMode = "Fast";

    life = 5;
    score = 0;
    scoreElement.innerHTML = score;
    lifeElement.innerHTML = life;

    slowMode.classList.remove("selected-mode");
    mediumMode.classList.remove("selected-mode");
    fastMode.classList.add("selected-mode");
    hardModeSelector.classList.remove("selected-mode");
}

function HardMode() {
    Fast();

    hardMode = true;

    selectedMode = "Hard";

    life = 5;
    score = 0;
    scoreElement.innerHTML = score;
    lifeElement.innerHTML = life;

    slowMode.classList.remove("selected-mode");
    mediumMode.classList.remove("selected-mode");
    fastMode.classList.remove("selected-mode");
    hardModeSelector.classList.add("selected-mode");
}

// Main functions for functionality
function ClickedHole(idx) {
    if (isMoleInHole[idx])
    {
        clearInterval(moleHideTimer);

        if (isGoldenMoleInHole[idx])
        {
            score += 5;
            ClickedGoldenMole(idx);
        }
        else
        {
            score++;
            ClickedMole(idx);
        }
        scoreElement.innerHTML = score;
    }
    else
    {
        if (isBombInHole[idx])
        {
            clearInterval(moleHideTimer);
            life -= 2;
            BlowBomb(idx);
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

    moleHideTimer = setTimeout(function() {
                        HideMole(idx);
                    }, (hardMode) ? getRndInteger(400,900) : upTime);
}

function HideMole(idx) {
    const hole = holes[idx];

    hole.classList.remove("golden-mole");
    hole.classList.remove("mole");
    hole.classList.remove("bomb");
    hole.classList.remove("mole-hit");
    hole.classList.remove("golden-mole-hit");
    hole.classList.remove("explosion");

    isMoleInHole[idx] = false;
    isGoldenMoleInHole[idx] = false;
    isBombInHole[idx] = false;
}

function showRandomMole() {
    let idx = getRndInteger(0, 9);

    ShowMole(idx);

    moleSpawnTimer = setTimeout(showRandomMole, waitTime);
}

function ClickedMole(idx) {
    const hole = holes[idx];

    hole.classList.remove("mole");
    hole.classList.remove("bomb");
    hole.classList.remove("golden-mole");
    hole.classList.add("mole-hit");

    setTimeout(function() {
        HideMole(idx);
    }, 300);
}

function ClickedGoldenMole(idx) {
    const hole = holes[idx];

    hole.classList.remove("mole");
    hole.classList.remove("bomb");
    hole.classList.remove("golden-mole");
    hole.classList.remove("explosion");
    hole.classList.add("golden-mole-hit");

    setTimeout(function() {
        HideMole(idx);
    }, 300);
}

function BlowBomb(idx) {
    const hole = holes[idx];

    hole.classList.remove("mole");
    hole.classList.remove("bomb");
    hole.classList.remove("golden-mole");
    hole.classList.remove("golden-mole-hit");
    hole.classList.add("explosion");

    setTimeout(function() {
        HideMole(idx);
    }, 300);
}

// Game state functions
function StartGame() {
    HideElement(gameStart);
    HideElement(leaderboardLink);
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

    started = true;
}

function GameOver() {
    ShowElement(gameOver);
    HideElement(leftArea);
    HideElement(holesArea);
    HideElement(rightArea);
    HideElement(speeds);
    ShowElement(leaderboardLink);

    clearTimeout(moleSpawnTimer);

    started = false;
}

function RestartGame() {
    HideElement(gameOver);
    HideElement(leaderboardLink);
    StartGame();
}

// Numpad support
window.onkeydown= function(x){
    if (started)
    {
        if(x.key == 1)
        {
            ClickedHole(6);
        }
        if(x.key == 2)
        {
            ClickedHole(7);
        }
        if(x.key == 3)
        {
            ClickedHole(8);
        }
        if(x.key == 4)
        {
            ClickedHole(3);
        }
        if(x.key == 5)
        {
            ClickedHole(4);
        }
        if(x.key == 6)
        {
            ClickedHole(5);
        }
        if(x.key == 7)
        {
            ClickedHole(0);
        }
        if(x.key == 8)
        {
            ClickedHole(1);
        }
        if(x.key == 9)
        {
            ClickedHole(2);
        }
    }
};

// Sumbit Score
async function SubmitScore() {
    const scoreToAdd = {name: nameInput.value, score: score, mode: selectedMode};

    const response = await fetch('https://molepatrolapi.azurewebsites.net/api/AddScore', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(scoreToAdd)
    })

    if (!response.ok)
    {
        console.error(text);
        return;
    }

    window.location.href = "leaderboard.html";
}