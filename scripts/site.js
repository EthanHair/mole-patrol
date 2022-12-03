// Getting the elements
//#region

const bgArea = document.getElementById("background");
const bgMusic = new Audio("audio/background-music.wav");
const menuSE = new Audio("audio/menu-press.wav");
const menuButtons = document.getElementsByClassName("clickable");
const musicBtn = document.getElementById("music");
const SEBtn = document.getElementById("sound-effects");

//#endregion

// Properties
//#region

let currentBackgroundFrame = 1;
let soundEffectsMuted = false;
let musicPlaying = false;

//#endregion

// General functions

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

// Animations
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

// Audio
function PlayMenuSE() {
    if (!soundEffectsMuted) {
        menuSE.play();
    }
}

function ToggleSE() {
    soundEffectsMuted = !soundEffectsMuted;

    if (soundEffectsMuted) {
        SEBtn.classList.remove("fa-volume");
        SEBtn.classList.add("fa-volume-slash");
    } else {
        SEBtn.classList.add("fa-volume");
        SEBtn.classList.remove("fa-volume-slash");
    }
}

function ToggleMusic() {
    if (musicPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove("fa-music");
        musicBtn.classList.add("fa-music-slash");
        musicPlaying = false;
    } else {
        bgMusic.play();
        musicBtn.classList.add("fa-music");
        musicBtn.classList.remove("fa-music-slash");
        musicPlaying = true;
    }
}

for (btn of menuButtons) {
    btn.addEventListener("click", () => {
        PlayMenuSE();
    });
}

bgMusic.loop = true;
bgMusic.autoplay = true;