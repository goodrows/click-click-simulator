var clickCount = 0;
var abilityCount = 0;
var abilityCost = 25;
var clickMultiplierDuration = 5; // in seconds
var clickMultiplierActive = false;
var clickMultiplierTimeout;
var highScore = 0;

// URLs for your sound files (Replace these with your actual URLs)
var backgroundMusicUrl = 'https://www.dropbox.com/scl/fi/etgspf74l1a5a3wjjhcye/g_can-you-make-an-background-music-for-an-clicker-game-that-is-loopable-the-song-must-be-casual-and-calm-and-welcoming_3_8df19.flac?rlkey=dx2r2hn459xxzv2n6h7jhqbly&dl=1';
var hoverSoundUrl = 'https://www.dropbox.com/scl/fi/xa0ti4xqxxdm58tydq7zt/g_now-can-you-make-an-ui-hover-sound_1_141d4.flac?rlkey=lhnhg1eyuyt8boo14wkwd4wio&dl=1';
var clickSoundUrl = 'https://www.dropbox.com/scl/fi/6x8yry4dmxhfrpubxqpzu/g_can-you-make-an-vibrant-click-sound_1_39781.flac?rlkey=61ddzy7intbqca308pxqx6ghh&dl=1';

// Creating Audio objects for each sound
var backgroundMusic = new Audio(backgroundMusicUrl);
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; // Adjust volume as needed

var hoverSound = new Audio(hoverSoundUrl);
var clickSound = new Audio(clickSoundUrl);

// Detect if the device is a touch device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

// Elements
var clickCountDisplay = document.getElementById("clickCount");
var abilityCountDisplay = document.getElementById("abilityCount");
var highScoreDisplay = document.getElementById("highScore");
var clickButton = document.getElementById("clickButton");
var abilityButton = document.getElementById("abilityButton");
var buyAbilityButton = document.getElementById("buyAbilityButton");
var resetButton = document.getElementById("resetButton");
var saveButton = document.getElementById("saveButton");
var abilityCostDisplay = document.getElementById("abilityCost");

// Game Logic Functions
function updateDisplays() {
    clickCountDisplay.innerText = clickCount;
    abilityCountDisplay.innerText = abilityCount;
    highScoreDisplay.innerText = highScore;
    abilityCostDisplay.innerText = abilityCost;
}

function checkHighScore() {
    if (clickCount > highScore) {
        highScore = clickCount;
        highScoreDisplay.innerText = highScore;
    }
}

// Sound Functions
function tryPlayingBackgroundMusic() {
    backgroundMusic.play().catch(function(error) {
        console.error("Background music playback failed due to no user interaction.", error);
    });
}

function playHoverSound() {
    if (!isTouchDevice) {
        hoverSound.currentTime = 0; // Rewind to the start
        hoverSound.play().catch(function(error) {
            console.error("Hover sound playback failed.", error);
        });
    }
}

function playClickSound() {
    clickSound.currentTime = 0; // Rewind to the start
    clickSound.play().catch(function(error) {
        console.error("Click sound playback failed.", error);
    });
}

// Event Listeners
document.body.addEventListener('click', tryPlayingBackgroundMusic, { once: true });
document.body.addEventListener('keypress', tryPlayingBackgroundMusic, { once: true });

if (!isTouchDevice) {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseover', playHoverSound);
    });
}

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', playClickSound);
});

clickButton.addEventListener("click", function() {
    if (clickMultiplierActive) {
        clickCount += 2; // 2x click multiplier during ability
    } else {
        clickCount++;
    }
    updateDisplays();
});

abilityButton.addEventListener("click", function() {
    if (abilityCount > 0 && !clickMultiplierActive) {
        clickMultiplierActive = true;
        abilityCount--;
        abilityButton.disabled = true;
        setTimeout(function() {
            clickMultiplierActive = false;
            abilityButton.disabled = false;
        }, clickMultiplierDuration * 1000);
        updateDisplays();
    }
});

buyAbilityButton.addEventListener("click", function() {
    if (clickCount >= abilityCost) {
        clickCount -= abilityCost;
        abilityCount++;
        abilityCost += 10; // Increase ability cost for subsequent purchases
        updateDisplays();
    }
});

resetButton.addEventListener("click", function() {
    var confirmReset = confirm("Are you sure you want to reset your progress?");
    if (confirmReset) {
        clickCount = 0;
        abilityCount = 0;
        highScore = 0;
        updateDisplays();
        localStorage.removeItem("saveData");
    }
});

saveButton.addEventListener("click", function() {
    var saveData = {
        clickCount: clickCount,
        abilityCount: abilityCount,
        highScore: highScore
    };
    localStorage.setItem("saveData", JSON.stringify(saveData));
    checkHighScore();
});

window.addEventListener("load", function() {
    var savedData = localStorage.getItem("saveData");
    if (savedData) {
        var saveData = JSON.parse(savedData);
        clickCount = saveData.clickCount;
        abilityCount = saveData.abilityCount;
        highScore = saveData.highScore;
        updateDisplays();
    }
});
