

// Start menu show/hide
function showStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.querySelector('.start-button');
    startMenu.classList.remove('hidden');
    startButton.classList.add('active');
}

function hideStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.querySelector('.start-button');
    startMenu.classList.add('hidden');
    startButton.classList.remove('active');
}