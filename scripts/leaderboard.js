// Getting the elements
//#region

const slowMode = document.getElementById("slow");
const mediumMode = document.getElementById("medium");
const fastMode = document.getElementById("fast");
const hardModeSelector = document.getElementById("hard-mode");
const nameLocation = document.getElementById("name-loc");
const scoreLocation = document.getElementById("score-loc");
const leaderboardBody = document.getElementById("body");
const leaderboardUnavailable = document.getElementById("unavailable");

//#endregion


// Game Modes
function Slow() {
    GetLeaderboard("Slow");

    slowMode.classList.add("selected-mode");
    mediumMode.classList.remove("selected-mode");
    fastMode.classList.remove("selected-mode");
    hardModeSelector.classList.remove("selected-mode");
}

function Medium() {
    GetLeaderboard("Medium");

    slowMode.classList.remove("selected-mode");
    mediumMode.classList.add("selected-mode");
    fastMode.classList.remove("selected-mode");
    hardModeSelector.classList.remove("selected-mode");
}

function Fast() {
    GetLeaderboard("Fast");

    slowMode.classList.remove("selected-mode");
    mediumMode.classList.remove("selected-mode");
    fastMode.classList.add("selected-mode");
    hardModeSelector.classList.remove("selected-mode");
}

function HardMode() {
    GetLeaderboard("Hard");

    slowMode.classList.remove("selected-mode");
    mediumMode.classList.remove("selected-mode");
    fastMode.classList.remove("selected-mode");
    hardModeSelector.classList.add("selected-mode");
}

async function GetLeaderboard(requestMode) {
    const payload = {name: "", mode: requestMode, number: 15};

    HideElement(leaderboardUnavailable);
    ShowElement(leaderboardBody);

    let text = "";

    let response;

    try 
    {
        response = await fetch('https://molepatrolapi.azurewebsites.net/api/GetLeaderboard', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
    } 
    catch (error) 
    {
        console.error(error);
        
        ShowElement(leaderboardUnavailable);
        HideElement(leaderboardBody);

        return;
    }

    scores = await response.json();

    if (!response.ok)
    {
        ShowElement(leaderboardUnavailable);
        HideElement(leaderboardBody);

        return;
    }

    nameLocation.innerHTML = "";
    scoreLocation.innerHTML = "";

    scores.forEach(score => {
        nameLocation.innerHTML += `<div class="entry">${score.name}</div>`;
        scoreLocation.innerHTML += `<div class="entry">${score.score}</div>`;
    });
}

HardMode();