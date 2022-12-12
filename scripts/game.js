// Getting the elements
//#region

const holes = document.getElementsByClassName("hole");
const scoreElement = document.getElementById("score");
const endScoreElement = document.getElementById("end-score");
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
const navLinks = document.getElementById("nav-links");
const nameInput = document.getElementById("name-input");
const hammerMouse = document.getElementById("hammer-mouse");
const startButton = document.getElementById("start-button");
const homeBtn = document.getElementById("home-btn");
const corkPowerUpIcon = document.getElementById("cork-icon");
const goldenHammerPowerUpIcon = document.getElementById("golden-hammer-icon");
const multiplierPowerUpIcon = document.getElementById("mult-icon");
const powerupTimerElement = document.getElementById("powerup-timer");
const whackSE = new Audio("audio/whack.wav");
const jumpSE1 = new Audio("audio/jump1.wav");
const jumpSE2 = new Audio("audio/jump2.wav");
const jumpSE3 = new Audio("audio/jump3.wav");
const jumpSE4 = new Audio("audio/jump4.wav");
const explosionSE = new Audio("audio/bomb_explosion.wav");
const missSE = new Audio("audio/miss.wav");
const gameOverSE = new Audio("audio/GameOver.wav");
const powerupSE = new Audio("audio/power-up.wav");
const powerdownSE = new Audio("audio/power-down.wav");

//#endregion

// Properties
//#region

let isMoleInHole = [false, false, false, false, false, false, false, false, false];
let isGoldenMoleInHole = [false, false, false, false, false, false, false, false, false];
let isBombInHole = [false, false, false, false, false, false, false, false, false];
let isCorkInHole = [false, false, false, false, false, false, false, false, false];
let availableHoles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let isGoldenHammer = false;
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
let goldenMolesHit = 0;
let activePowerup = false;
let scoreMultiplier = 1;
let powerupTimer;
let powerupTimeLeft;

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
function ClickedHole(idx, override = false) {
    let canProcess = override ? true : !isGoldenHammer;

    if (canProcess) {
        if (isMoleInHole[idx])
        {
            clearInterval(moleHideTimer);

            if (isGoldenMoleInHole[idx])
            {
                score += 5 * scoreMultiplier;
                ClickedGoldenMole(idx);
            }
            else
            {
                score += 1 * scoreMultiplier;
                ClickedMole(idx);
            }
            scoreElement.innerHTML = score;
            endScoreElement.innerHTML = score;
        }
        else
        {
            if (!isCorkInHole[idx]) 
            {
                if (isBombInHole[idx])
                {
                    clearInterval(moleHideTimer);
                    if (!isGoldenHammer) {
                        life -= 2;
                    }
                    BlowBomb(idx);
                }
                else
                {
                    if (!isGoldenHammer) {
                        life--;                        
                    }
                    PlayMissSE();
                }
            
                if (life <= 0)
                {
                    GameOver();
                }
                lifeElement.innerHTML = life;
            }
        }
    }
}

function ShowMole(idx) {
    const hole = holes[idx];
    let addedMole = false;

    if (molesTillGolden <= 0)
    {
        hole.classList.remove("mole");
        hole.classList.remove("bomb");
        hole.classList.add("golden-mole");

        molesTillGolden = (hardMode) ? getRndInteger(15,25) : getRndInteger(10, 20);

        isGoldenMoleInHole[idx] = true;
        isMoleInHole[idx] = true;
        addedMole = true;
        PlayRndJumpSE();

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

            isMoleInHole[idx] = true;
            addedMole = true;
            PlayRndJumpSE();

            if (hardMode)
            {
                molesTillBomb--
            }
        }
        
        molesTillGolden--;
    }    
    
    let moleHideTime = (hardMode) ? getRndInteger(400 / GetTimeMultiplier(),900 / GetTimeMultiplier()) : upTime;

    if (isGoldenHammer && addedMole) {
        setTimeout(() => {
            HitMoleNumPad(idx, true);
        }, moleHideTime * 0.6);
    }

    moleHideTimer = setTimeout(function() {
                        HideMole(idx);
                    }, moleHideTime);
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
    let rndIdx = getRndInteger(0, availableHoles.length);
    let holeIdx = availableHoles[rndIdx];

    ShowMole(holeIdx);

    moleSpawnTimer = setTimeout(showRandomMole, (hardMode) ? getRndInteger(800 / GetTimeMultiplier(),1000 / GetTimeMultiplier()) : waitTime);
}

function ClickedMole(idx) {
    PlayWhackSE();
    
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
    PlayWhackSE();
    
    const hole = holes[idx];
    if (!activePowerup) {
        goldenMolesHit++;
    }

    hole.classList.remove("mole");
    hole.classList.remove("bomb");
    hole.classList.remove("golden-mole");
    hole.classList.remove("explosion");
    hole.classList.add("golden-mole-hit");

    if (goldenMolesHit >= 4) {
        ActivateRndPowerup();
    }

    setTimeout(function() {
        HideMole(idx);
    }, 300);
}

function BlowBomb(idx) {
    PlayExplosionSE();

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
    HideElement(navLinks);
    ShowElement(leftArea);
    ShowElement(homeBtn);
    ShowElement(holesArea);
    ShowElement(rightArea);
    ShowElement(speeds);
    ShowElement(hammerMouse);

    score = 0;
    scoreElement.innerHTML = score;
    life = 5;
    lifeElement.innerHTML = life;

    showRandomMole();
    Medium();

    started = true;
}

function GameOver() {
    PlayGameOverSE();

    ShowElement(gameOver);
    HideElement(leftArea);
    HideElement(holesArea);
    HideElement(rightArea);
    HideElement(speeds);
    ShowElement(navLinks);
    HideElement(hammerMouse);

    clearTimeout(moleSpawnTimer);

    started = false;
}

function RestartGame() {
    HideElement(gameOver);
    HideElement(navLinks);
    StartGame();
}

// Numpad support
window.addEventListener("keydown", x => {
    if (started)
    {
        if(x.key == 1)
        {
            HitMoleNumPad(6);
        }
        if(x.key == 2)
        {
            HitMoleNumPad(7);
        }
        if(x.key == 3)
        {
            HitMoleNumPad(8);
        }
        if(x.key == 4)
        {
            HitMoleNumPad(3);
        }
        if(x.key == 5)
        {
            HitMoleNumPad(4);
        }
        if(x.key == 6)
        {
            HitMoleNumPad(5);
        }
        if(x.key == 7)
        {
            HitMoleNumPad(0);
        }
        if(x.key == 8)
        {
            HitMoleNumPad(1);
        }
        if(x.key == 9)
        {
            HitMoleNumPad(2);
        }
    }
});

function HitMoleNumPad(idx, override = false) {
    let canProcess = override ? true : !isGoldenHammer;

    if (canProcess) {
        ClickedHole(idx, override);

        let holeRect = holes[idx].getBoundingClientRect();

        let holeMidishX = holeRect.x + (holeRect.width/4);
        let holeY = holeRect.y;
        
	    hammerMouse.style.left = `${holeMidishX}px`;
        hammerMouse.style.top = `${holeY}px`;
        
	    hammerMouse.style.animation = animation;
        setTimeout(function() {
            hammerMouse.style.animation = "";
        }, 250);
    }
}

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

// Make the hammer follow the mouse
const animation = "0.25s 1 normal whack";

window.addEventListener("click", function(e) {
    if (started && IsInHolesArea(e.clientX, e.clientY) && !isGoldenHammer) {
        CheckHolesClick(e.clientX, e.clientY);

        hammerMouse.style.animation = animation;
        setTimeout(function() {
            hammerMouse.style.animation = "";
        }, 250);
    }
});

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

window.addEventListener("mousemove", function(e) {
    if (IsInHolesArea(e.clientX, e.clientY) && !isGoldenHammer) {
        let holesAreaRect = holesArea.getBoundingClientRect();
        let bgAreaRect = bgArea.getBoundingClientRect();
        let hammerRect = hammerMouse.getBoundingClientRect();
        let minX = holesAreaRect.x - 64;
        let maxX = minX + holesAreaRect.width + 64;
        let minY = holesAreaRect.y;
        let maxY = bgAreaRect.y + bgAreaRect.height - hammerRect.height;
        hammerMouse.style.left = `${clamp(e.clientX - 50, minX, maxX)}px`;
        hammerMouse.style.top = `${clamp(e.clientY - 50, minY, maxY)}px`;
    }
});

// Check holes click
function CheckHolesClick(x, y) {
    let miss = true;
    for (let i = 0; i < holes.length; i++) {
        if (IsClickInHole(x, y, holes[i])) {
            ClickedHole(i);
            miss = false;
            return
        }
    }
    
    if (miss) {
        PlayMissSE();
    }
}

function IsClickInHole(x, y, hole){
    let holeRect = hole.getBoundingClientRect();
    
    let holeMinX = holeRect.x;
    let holeMaxX = holeMinX + holeRect.width;
    let holeMinY = holeRect.y;
    let holeMaxY = holeMinY + holeRect.height;

    if (x >= holeMinX && x <= holeMaxX && y >= holeMinY && y <= holeMaxY) {
        return true;
    } else {
        return false;
    }
}

function IsInHolesArea(x, y) {
    let holeAreaRect = holesArea.getBoundingClientRect();
    
    let holesMinX = holeAreaRect.x;
    let holesMaxX = holesMinX + holeAreaRect.width;
    let holesMinY = holeAreaRect.y;
    let holesMaxY = holesMinY + holeAreaRect.height;

    if (x >= holesMinX && x <= holesMaxX && y >= holesMinY && y <= holesMaxY) {
        return true;
    } else {
        return false;
    }
}

// Increasing the difficulty as the score increases
function RoundDownToNearestMult(number, mult) {
    let quo = Math.floor(number/mult);
    let multipleOfMult = mult * quo;
    return multipleOfMult;
}

function GetTimeMultiplier() {
    return 0.01 * RoundDownToNearestMult(score, 20) + 1
}

// Audio
function PlayWhackSE() {
    if (!soundEffectsMuted) {
        whackSE.play();
    }
}

function PlayJumpSE1() {
    if (!soundEffectsMuted) {
        jumpSE1.play();
    }
}

function PlayJumpSE2() {
    if (!soundEffectsMuted) {
        jumpSE2.play();
    }
}

function PlayJumpSE3() {
    if (!soundEffectsMuted) {
        jumpSE3.play();
    }
}

function PlayJumpSE4() {
    if (!soundEffectsMuted) {
        jumpSE4.play();
    }
}

function PlayExplosionSE() {
    if (!soundEffectsMuted) {
        explosionSE.play();
    }
}

function PlayMissSE() {
    if (!soundEffectsMuted) {
        missSE.play();
    }
}

function PlayGameOverSE() {
    if (!soundEffectsMuted) {
        gameOverSE.play();
    }
}

function PlayPowerupSE() {
    if (!soundEffectsMuted) {
        powerupSE.play();
    }
}

function PlayPowerdownSE() {
    if (!soundEffectsMuted) {
        powerdownSE.play();
    }
}

let prevJumpIdx = null;
function PlayRndJumpSE() {
    let idx = getRndInteger(1,5);

    while (idx == prevJumpIdx) {
        idx = getRndInteger(1,5);
    }

    switch (idx)
    {
        case 1:
            PlayJumpSE1();
            break;
        case 2:
            PlayJumpSE2();
            break;
        case 3:
            PlayJumpSE3();
            break;
        case 4:
            PlayJumpSE4();
            break;
        default:
            PlayJumpSE1();
    }

    prevJumpIdx = idx;
}

// PowerUps
let corkPowerUp = function() {
    let time = 10000;

    const numberOfCorkedHoles = getRndInteger(4,8);
    const corkedHoles = [];
    while (corkedHoles.length < numberOfCorkedHoles) {
        let rndIdx = getRndInteger(0, 9);
        if (!corkedHoles.includes(rndIdx)) {
            corkedHoles.push(rndIdx);
        }
    }

    for (idx of corkedHoles) {
        HideMole(idx);

        holes[idx].classList.add("cork");

        isCorkInHole[idx] = true;

        availableHoles.splice(availableHoles.indexOf(idx), 1);
    }

    let endPowerup = function() {
        for (idx of corkedHoles) {
            HideMole(idx);
    
            holes[idx].classList.remove("cork");
    
            isCorkInHole[idx] = false;
        }

        availableHoles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    };

    StartPowerUpTimer(time, endPowerup);
};

let goldenHammerPowerUp = function() {
    let time = 15000;

    isGoldenHammer = true;
    hammerMouse.classList.add("golden-hammer");

    let endPowerup = function() {
        isGoldenHammer = false;
        hammerMouse.classList.remove("golden-hammer");
    };

    StartPowerUpTimer(time, endPowerup);
}

let scoreMultiplierPowerUp = function() {
    let time = 20000;

    scoreMultiplier = 3;

    let endPowerup = function() {
        scoreMultiplier = 1;
    };

    StartPowerUpTimer(time, endPowerup);
}

const powerups = [{ icon: corkPowerUpIcon, activate: corkPowerUp }, 
                  { icon: goldenHammerPowerUpIcon, activate: goldenHammerPowerUp },
                  { icon: multiplierPowerUpIcon, activate: scoreMultiplierPowerUp }]

function ActivateRndPowerup(overrideIdx = -1) {
    if (!activePowerup) {
        let powerup;
        if (overrideIdx == -1) {
            powerup = powerups[getRndInteger(0, powerups.length)];
        } else {
            powerup = powerups[overrideIdx];
        }
    
        activePowerup = true;
        PlayPowerupSE();
    
        powerup.icon.classList.add("active-powerup");
        powerup.activate();
    }
}

function DeactivatePowerup() {
    activePowerup = false;
    PlayPowerdownSE();

    for (powerup of powerups) {
        powerup.icon.classList.remove("active-powerup");
    }
}

function StartPowerUpTimer(time, endPowerup) {
    powerupTimeLeft = time / 1000;
    powerupTimerElement.innerHTML = powerupTimeLeft;

    powerupTimer = setInterval(() => {
        powerupTimeLeft--;
        if (powerupTimeLeft >= 1) {
            powerupTimerElement.innerHTML = powerupTimeLeft;
        }
        else {
            endPowerup();
            DeactivatePowerup();
            clearInterval(powerupTimer);
            powerupTimerElement.innerHTML = "";
        }
    }, 1000);
}