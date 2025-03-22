let highestZIndex = 100; // starting z-index


// Deactivate all windows when clicking (or tapping) outside them.
document.addEventListener('mousedown', deactivateAllWindows);
document.addEventListener('touchstart', deactivateAllWindows);


// Bring window to front on pointer down.
document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', bringToFront);
    win.addEventListener('touchstart', bringToFront);
});

// Make windows draggable (supports mobile via touch events)
document.querySelectorAll('.window').forEach(makeWindowDraggable);


// Window controls: close, minimize, maximize, restore
document.querySelectorAll('.title-bar-controls button[aria-label="Close"]').forEach(button => {
    button.addEventListener('click', function () {
        let win = this.closest('.window');
        win.classList.add('hidden');
        const btn = document.querySelector(`.taskbar-button[for="${win.id}"]`);
        btn.classList.add('hidden');
    });
});

document.querySelectorAll('.title-bar-controls button[aria-label="Minimize"]').forEach(button => {
    button.addEventListener('click', () => minimizeWindow(button.closest('.window')));
});

document.querySelectorAll('.title-bar-controls button[aria-label="Maximize"]').forEach(button => {
    button.addEventListener('click', () => maximizeWindow(button.closest('.window')));
});

document.querySelectorAll('.title-bar-controls button[aria-label="Restore"]').forEach(button => {
    button.addEventListener('click', () => restoreFromMaximized(button.closest('.window')));
});

// Add double-click support on each title bar to maximize/restore the window.
document.querySelectorAll('.title-bar').forEach(titleBar => {
    titleBar.addEventListener('dblclick', function () {
        const win = this.closest('.window');
        if (win.isMaximized) {
            restoreFromMaximized(win);
        } else {
            maximizeWindow(win);
        }
    });
});

document.querySelectorAll('.taskbar-button').forEach(button => {
    button.addEventListener('click', function (event) {
        const targetId = event.target.getAttribute('for');
        const win = document.getElementById(targetId);
        if (win.isMinimized) {
            highestZIndex++;
            win.style.zIndex = highestZIndex;
            restoreWindow(win);
        } else if (win.style.zIndex == highestZIndex) {
            minimizeWindow(win);
        } else {
            highestZIndex++;
            win.style.zIndex = highestZIndex;
            updateTitleBarClasses(win);
        }
    });
});

// Desktop icon click to highlight
document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', function () {
        // Remove highlight from all icons and icon-labels
        document.querySelectorAll('.desktop-icon .icon img, .desktop-icon .icon-label').forEach(element => {
            element.classList.remove('highlighted-icon', 'highlighted-label', 'selected');
        });

        // Add highlight to the clicked icon and icon-label
        const iconImg = this.querySelector('.icon img');
        const iconLabel = this.querySelector('.icon-label');
        if (iconImg) {
            iconImg.classList.add('highlighted-icon');
        }
        if (iconLabel) {
            iconLabel.classList.add('highlighted-label');
            iconLabel.classList.add('selected');
        }
    });
});

document.querySelector('.taskbar').addEventListener('click', function () {
    const taskbar = document.querySelector('.taskbar');
    taskbar.style.zIndex = highestZIndex + 1;
});

document.querySelector('.start-button').addEventListener('click', function () {
    const startMenu = document.getElementById('start-menu');
    if (startMenu.classList.contains('hidden')) {
        showStartMenu();
        startMenu.style.animationName = 'scrollUp';
    } else {
        hideStartMenu();
        startMenu.style.animationName = '';
    }
});

// Show desktop button functionality
document.querySelector('.show-desktop').addEventListener('click', function () {
    const windows = document.querySelectorAll('.app-window');
    const allMinimized = Array.from(windows).every(win => win.isMinimized);

    if (allMinimized) {
        // Restore all windows
        windows.forEach(win => {
            restoreWindow(win);
        });
    } else {
        // Minimize all windows
        windows.forEach(win => {
            minimizeWindow(win, true);
        });
    }
});

// Hide start menu when clicking outside
document.addEventListener('click', function (event) {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.querySelector('.start-button');
    if (!startMenu.classList.contains('hidden') && !startMenu.contains(event.target) && !startButton.contains(event.target)) {
        hideStartMenu();
    }
});

// Update clock in taskbar
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLocaleUpperCase();
    const dateString = now.toDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('clock').textContent = timeString;
    document.querySelector('.taskbar-clock').title = dateString;
}
setInterval(updateClock, 1000);
updateClock();

// Start menu click to open window
document.querySelectorAll('.start-menu-item').forEach(icon => {
    icon.addEventListener('click', function (event) {
        CreateAndOpenApp(event);
        hideStartMenu(); // Call hideStartMenu after the handler function
    });
});