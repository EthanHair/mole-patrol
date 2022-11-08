// Getting the elements
//#region

const bgArea = document.getElementById("background");

//#endregion

// Properties
//#region

let currentBackgroundFrame = 1;

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