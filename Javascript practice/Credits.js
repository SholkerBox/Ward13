const creditsElement = document.querySelector('.Credits');
const BackToMainMenuButton = document.getElementById('BacktoMainMenu');
if (BackToMainMenuButton) {
    BackToMainMenuButton.addEventListener('click', () => {
        window.location.href = "start menu.html";
    });
} else {
    console.error("Back to Menu button element not found in the DOM!")
}
const animationDuration = 20; // Duration of your CSS animation in seconds

creditsElement.addEventListener('animationend', () => {
    setTimeout(() => {
            console.log("Credits animation ended.");
        if (BackToMainMenuButton) {
            BackToMainMenuButton.classList.add('back-to-menu-fixed');
            BackToMainMenuButton.addEventListener('click', () => {
                window.location.href = "start menu.html"; // Link back to your menu
            });
        }
    }, animationDuration * 1000 * 1); // Adjust the 0.8 to trigger slightly before the end (80%)
});

// Optionally, ensure the button is initially not fixed
if (BackToMainMenuButton) {
    BackToMainMenuButton.classList.remove('back-to-menu-fixed');
}