const holes = document.getElementsByClassName("hole");
const scoreElement = document.getElementById("score");
const lifeElement = document.getElementById("life");

let isMoleInHole = [false, false, false, false, false, false, false, false, false];
let score = 0;
let life = 3;

let waitTime = 2000;
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
        console.log("Got it!");
        HideMole(idx);
        score++;
        scoreElement.innerHTML = score;
    }
    else
    {
        console.log("Missed!");
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
    console.log(`Showing mole ${idx}...`);

    ShowMole(idx);

    setTimeout(showRandomMole, waitTime);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

showRandomMole();