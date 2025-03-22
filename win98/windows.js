let highestZIndex = 100; // starting z-index

// Utility function to get pointer coordinates (supports mouse and touch)
function getPointerCoords(e) {
    if (e.touches && e.touches.length) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
}

// Common animation using a transition spec
function animateTransition(element, targetStyles, callback, transitionSpec = 'left 0.25s ease, top 0.25s ease, width 0.25s ease') {
    element.style.transition = transitionSpec;
    // Force reflow so the transition applies immediately
    element.offsetWidth;
    Object.entries(targetStyles).forEach(([prop, value]) => {
        element.style[prop] = value;
    });
    element.addEventListener('transitionend', function handler() {
        element.removeEventListener('transitionend', handler);
        callback();
    });
}

// Deactivate all windows when clicking (or tapping) outside them.
document.addEventListener('mousedown', deactivateAllWindows);
document.addEventListener('touchstart', deactivateAllWindows);

function deactivateAllWindows(event) {
    if (!event.target.closest('.window')) {
        document.querySelectorAll('.window').forEach(win => {
            const titleBar = win.querySelector('.title-bar');
            const taskbarButton = document.querySelector(`.taskbar-button[for="${win.id}"]`);

            if (titleBar) {
                titleBar.classList.add('inactive');
            }
            if (taskbarButton) {
                taskbarButton.classList.remove('active');
            }
        });

        if (event.target.closest('.desktop')) {
            // Remove highlight from all icons and icon-labels
            document.querySelectorAll('.desktop-icon .icon img, .desktop-icon .icon-label').forEach(element => {
                element.classList.remove('highlighted-icon', 'highlighted-label');
            });
        } else {
            // Remove highlight from all icons and icon-labels
            document.querySelectorAll('.desktop-icon .icon img, .desktop-icon .icon-label').forEach(element => {
                element.classList.remove('highlighted-icon', 'highlighted-label', 'selected');
            });
        }
    } else {
        // Remove highlight from all icons and icon-labels
        document.querySelectorAll('.desktop-icon .icon img, .desktop-icon .icon-label').forEach(element => {
            element.classList.remove('highlighted-icon', 'highlighted-label', 'selected');
        });
    }
}

// Function to close all windows
function closeAllWindows() {
    const windows = document.querySelectorAll('.app-window');
    windows.forEach(window => {
        // Get the window ID
        const windowId = window.id;
        // Find and remove the corresponding taskbar button
        const taskbarButton = document.querySelector(`.taskbar-button[for="${windowId}"]`);
        if (taskbarButton) {
            taskbarButton.remove();
        }
        // Remove the window
        window.remove();
    });
}

// Bring window to front on pointer down.
document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', bringToFront);
    win.addEventListener('touchstart', bringToFront);
});

function bringToFront() {
    highestZIndex++;
    this.style.zIndex = highestZIndex;
    updateTitleBarClasses(this);
}

function updateTitleBarClasses(activeWindow) {
    document.querySelectorAll('.window').forEach(win => {
        const titleBar = win.querySelector('.title-bar');
        const taskbarButton = document.querySelector(`.taskbar-button[for="${win.id}"]`);
        if (titleBar || taskbarButton) {
            if (win === activeWindow) {
                if (titleBar) titleBar.classList.remove('inactive');
                if (taskbarButton) taskbarButton.classList.add('active'); // Add 'active' class
            } else {
                if (titleBar) titleBar.classList.add('inactive');
                if (taskbarButton) taskbarButton.classList.remove('active'); // Remove 'active' class
            }
        }
    });
}

// Make windows draggable (supports mobile via touch events)
document.querySelectorAll('.window').forEach(makeWindowDraggable);

function makeWindowDraggable(win) {
    const titleBar = win.querySelector('.title-bar');
    const desktopArea = document.querySelector('.desktop-area');
    let offsetX, offsetY, isDragging = false;
    let dragOutline = null;
    let startCoords = null, initialRect = null;
    const dragThreshold = 5; // pixels

    function startDragging(e) {
        // Do not start dragging if clicking controls
        if (e.target.closest('.title-bar-controls')) return;
        if (win.isMaximized) return;

        const desktopRect = desktopArea.getBoundingClientRect();
        const pointerCoords = getPointerCoords(e);

        // Prevent mouse from going outside desktop-area
        if (
            pointerCoords.x < desktopRect.left ||
            pointerCoords.x > desktopRect.right ||
            pointerCoords.y < desktopRect.top ||
            pointerCoords.y > desktopRect.bottom
        ) {
            return;
        }

        isDragging = true;
        initialRect = win.getBoundingClientRect();
        startCoords = pointerCoords;
        offsetX = startCoords.x - initialRect.left;
        offsetY = startCoords.y - initialRect.top;
    }

    function drag(e) {
        if (!isDragging) return;

        const desktopRect = desktopArea.getBoundingClientRect();
        const currentCoords = getPointerCoords(e);

        // Prevent mouse from going outside desktop-area
        if (
            currentCoords.x < desktopRect.left ||
            currentCoords.x > desktopRect.right ||
            currentCoords.y < desktopRect.top ||
            currentCoords.y > desktopRect.bottom
        ) {
            return;
        }

        const dx = currentCoords.x - startCoords.x;
        const dy = currentCoords.y - startCoords.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (!dragOutline && distance > dragThreshold) {
            // Create drag outline
            dragOutline = document.createElement('div');
            dragOutline.style.position = 'absolute';
            dragOutline.style.border = '4px solid black';
            dragOutline.style.boxSizing = 'border-box';
            dragOutline.style.width = initialRect.width + 'px';
            dragOutline.style.height = initialRect.height + 'px';
            dragOutline.style.left = initialRect.left + 'px';
            dragOutline.style.top = initialRect.top + 'px';
            dragOutline.style.pointerEvents = 'none';
            highestZIndex++;
            win.style.zIndex = highestZIndex;
            dragOutline.style.zIndex = highestZIndex + 1;
            win.parentElement.appendChild(dragOutline);
        }
        if (dragOutline) {
            dragOutline.style.left = (currentCoords.x - offsetX) + 'px';
            dragOutline.style.top = (currentCoords.y - offsetY) + 'px';
        }
    }

    function stopDragging() {
        if (!isDragging) return;
        isDragging = false;

        if (dragOutline) {
            // Get initial dimensions to preserve
            const initialWidth = win.offsetWidth;

            // Position the window
            win.style.position = 'absolute';
            win.style.left = dragOutline.style.left;
            win.style.top = dragOutline.style.top;

            // Ensure width is preserved
            win.style.width = initialWidth + 'px';

            // Remove outline
            dragOutline.parentElement.removeChild(dragOutline);
            dragOutline = null;
        }
    }

    titleBar.addEventListener('mousedown', startDragging);
    titleBar.addEventListener('touchstart', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);
}

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

function minimizeWindow(win, withoutAnimation = false) {
    if (win.isMinimized) return;
    const titleBar = win.querySelector('.title-bar');
    // Capture original dimensions
    win.originalTitleBarRect = titleBar.getBoundingClientRect();
    if (!win.isMaximized) win.originalWindowRect = win.getBoundingClientRect();

    const titleBarCopy = createTitleBarCopy(titleBar, win.originalTitleBarRect);
    document.body.appendChild(titleBarCopy);

    // Animate to taskbar button target
    const btn = document.querySelector(`.taskbar-button[for="${win.id}"]`);
    const btnRect = btn.getBoundingClientRect();

    if (withoutAnimation) {
        win.style.display = 'none';
        btn.classList.remove('active');
        titleBarCopy.remove();
        win.isMinimized = true;
    } else {
        animateTransition(titleBarCopy, {
            left: btnRect.left + 'px',
            top: btnRect.top + 'px',
            width: btnRect.width + 'px'
        }, function () {
            win.style.display = 'none';
            btn.classList.remove('active');
            titleBarCopy.remove();
            win.isMinimized = true;
        });
    }
}

function restoreWindow(win) {
    if (!win.isMinimized) return;
    const titleBar = win.querySelector('.title-bar');

    const btn = document.querySelector(`.taskbar-button[for="${win.id}"]`);
    const btnRect = btn.getBoundingClientRect();
    titleBar.classList.remove('inactive');
    btn.classList.add('active');

    const titleBarCopy = createTitleBarCopy(titleBar, btnRect);
    document.body.appendChild(titleBarCopy);

    animateTransition(titleBarCopy, {
        left: win.originalTitleBarRect.left + 'px',
        top: win.originalTitleBarRect.top + 'px',
        width: win.originalTitleBarRect.width + 'px'
    }, function () {
        win.style.display = '';
        titleBarCopy.remove();
        win.isMinimized = false;
        // Restore window position using its stored rect if available
        if (!win.isMaximized && win.originalWindowRect) {
            win.style.position = 'absolute';
            win.style.left = win.originalWindowRect.left + 'px';
            win.style.top = win.originalWindowRect.top + 'px';
            win.style.width = win.originalWindowRect.width + 'px';
        }
    });
}

function maximizeWindow(win) {
    if (win.isMaximized) return;

    const titleBar = win.querySelector('.title-bar');
    const windowContent = win.querySelector('.window-content');
    const desktopArea = document.getElementById('desktop-area');

    // Store original dimensions for later restoration
    win.originalTitleBarRect = titleBar.getBoundingClientRect();
    win.originalWindowRect = win.getBoundingClientRect();

    const titleBarCopy = createTitleBarCopy(titleBar, win.originalTitleBarRect);
    document.body.appendChild(titleBarCopy);

    // Get desktop area dimensions
    const desktopRect = desktopArea.getBoundingClientRect();

    animateTransition(titleBarCopy, {
        left: desktopRect.left + 'px',
        top: desktopRect.top + 'px',
        width: desktopRect.width + 'px'
    }, function () {
        // Get window computed styles to account for borders
        const computedStyle = window.getComputedStyle(win);
        const borderTopWidth = parseInt(computedStyle.borderTopWidth, 10) || 0;
        const borderRightWidth = parseInt(computedStyle.borderRightWidth, 10) || 0;
        const borderBottomWidth = parseInt(computedStyle.borderBottomWidth, 10) || 0;
        const borderLeftWidth = parseInt(computedStyle.borderLeftWidth, 10) || 0;

        // Calculate dimensions that will fit inside desktop area
        const adjustedWidth = desktopRect.width - borderLeftWidth - borderRightWidth;
        const adjustedHeight = desktopRect.height - borderTopWidth - borderBottomWidth;

        // Set window position and size to fit exactly within desktop area
        win.style.position = 'absolute';
        win.style.left = borderLeftWidth + 'px';
        win.style.top = borderTopWidth + 'px';
        win.style.width = adjustedWidth + 'px';
        win.style.height = adjustedHeight + 'px';

        // Make sure the window is a direct child of desktop area for proper positioning
        if (win.parentElement !== desktopArea) {
            desktopArea.appendChild(win);
        }

        win.isMaximized = true;
        updateWindowControls(win);
        titleBarCopy.remove();
    });
}

function restoreFromMaximized(win) {
    if (!win.isMaximized) return;

    const titleBar = win.querySelector('.title-bar');
    const windowContent = win.querySelector('.window-content');
    const desktopArea = document.getElementById('desktop-area');
    const desktopRect = desktopArea.getBoundingClientRect();
    const titleBarCopy = createTitleBarCopy(titleBar, {
        left: desktopRect.left,
        top: desktopRect.top,
        width: desktopRect.width
    });
    document.body.appendChild(titleBarCopy);

    animateTransition(titleBarCopy, {
        left: win.originalWindowRect.left + 'px',
        top: win.originalWindowRect.top + 'px',
        width: win.originalWindowRect.width + 'px'
    }, function () {
        // Move window back to the desktop container (not the desktop-area)
        document.querySelector('.desktop').appendChild(win);

        // Restore original position and size
        win.style.position = 'absolute';
        win.style.left = win.originalWindowRect.left + 'px';
        win.style.top = win.originalWindowRect.top + 'px';
        win.style.width = win.originalWindowRect.width + 'px';
        win.style.height = win.originalWindowRect.height + 'px';

        win.isMaximized = false;
        updateWindowControls(win);
        titleBarCopy.remove();
    });
}

function updateWindowControls(win) {
    const maximizeBtn = win.querySelector('.title-bar-controls button[aria-label="Maximize"]');
    const restoreBtn = win.querySelector('.title-bar-controls button[aria-label="Restore"]');

    if (win.isMaximized) {
        maximizeBtn.style.display = 'none';
        restoreBtn.style.display = 'inline-block';
        win.style.resize = 'none';
    } else {
        maximizeBtn.style.display = 'inline-block';
        restoreBtn.style.display = 'none';
        win.style.resize = 'both';
    }
}

// Helper to create a copy of the title bar without controls
function createTitleBarCopy(titleBar, rect) {
    const copy = titleBar.cloneNode(true);
    const controls = copy.querySelector('.title-bar-controls');
    if (controls) controls.remove();
    copy.style.position = 'fixed';
    copy.style.left = rect.left + 'px';
    copy.style.top = rect.top + 'px';
    copy.style.width = rect.width + 'px';
    copy.style.zIndex = highestZIndex + 1;
    copy.classList.remove('inactive');
    return copy;
}

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

function CreateAndOpenApp(event) {
    const element = event.currentTarget;
    const windowId = element.getAttribute('for');
    // If this is a start menu item without full data, get data from the desktop icon
    let windowTitle, windowIcon, windowContent;

    // If this element has all the data, use it directly
    if (element.hasAttribute('title') && element.hasAttribute('data-icon')) {
        windowTitle = element.getAttribute('title') || 'New Window';
        windowIcon = element.getAttribute('data-icon') || '/win98/icons/shell32_3.ico';
        windowContent = element.getAttribute('data-content') || '';
    }
    // Otherwise, find the corresponding desktop icon and get data from there
    else {
        const desktopIcon = document.querySelector(`.desktop-icon[for="${windowId}"]`);
        if (desktopIcon) {
            windowTitle = desktopIcon.getAttribute('title') || 'New Window';
            windowIcon = desktopIcon.getAttribute('data-icon') || '/win98/icons/shell32_3.ico';
            windowContent = desktopIcon.getAttribute('data-content') || '';
        } else {
            // Fallback values if no matching desktop icon is found
            windowTitle = 'New Window';
            windowIcon = '/win98/icons/shell32_3.ico';
            windowContent = '';
        }
    }

    // Check if window already exists (optional, to prevent duplicates)
    const existingWindow = document.getElementById(windowId);
    if (existingWindow) {
        // If you want to bring existing window to front instead of creating duplicate
        existingWindow.classList.remove('hidden');
        highestZIndex++;
        existingWindow.style.zIndex = highestZIndex;
        updateTitleBarClasses(existingWindow);

        const existingTaskbarButton = document.querySelector(`.taskbar-button[for="${windowId}"]`);
        if (existingTaskbarButton) {
            existingTaskbarButton.classList.remove('hidden');
        }
        return;
    }

    // Create new window element
    const content = document.createElement('div');
    content.innerHTML = `${windowContent}`;

    const newWindow = createAppWindow({
        windowId: windowId,
        windowTitle: `${windowTitle}`,
        windowIcon: `${windowIcon}`,
        contentElement: content
    });

    const taskbarButton = createTaskbarButton(windowId, windowIcon, windowTitle);

    // Setup event listeners for window controls
    setupWindowControls(newWindow, taskbarButton);
    // Update title bar classes to show this as active window
    updateTitleBarClasses(newWindow);
}

function createAppWindow({ windowId, windowTitle, windowIcon, contentElement, centered = false }) {
    const newWindow = document.createElement('div');
    newWindow.id = windowId;
    newWindow.className = 'window app-window';

    // Position the window with slight randomization for cascade effect
    const topPosition = 30 + (Math.random() * 60);
    const leftPosition = 50 + (Math.random() * 100);
    newWindow.style.top = `${topPosition}px`;
    newWindow.style.left = `${leftPosition}px`;

    // Set highest z-index
    highestZIndex++;
    newWindow.style.zIndex = highestZIndex;

    // Create window structure
    newWindow.innerHTML = `
        <div class="title-bar">
            <div class="title-bar-text">
                <img src="${windowIcon}" alt="Icon">${windowTitle}
            </div>
            <div class="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Restore" style="display: none;"></button>
                <button aria-label="Close"></button>
            </div>
        </div>
        <div class="window-content"></div>
    `;

    // Append provided contentElement
    const contentContainer = newWindow.querySelector('.window-content');
    if (contentElement) {
        contentContainer.appendChild(contentElement);
    }

    // Add to document
    document.body.appendChild(newWindow);

    return newWindow;
}


// Helper function to setup window controls (minimize, maximize, close)
function setupWindowControls(windowElement, taskbarButton) {
    const titleBar = windowElement.querySelector('.title-bar');
    const closeButton = windowElement.querySelector('button[aria-label="Close"]');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            windowElement.remove();
            taskbarButton.remove();
        });
    }

    const minimizeButton = windowElement.querySelector('button[aria-label="Minimize"]');
    const maximizeButton = windowElement.querySelector('button[aria-label="Maximize"]');
    const restoreButton = windowElement.querySelector('button[aria-label="Restore"]');
    if (minimizeButton) {
        minimizeButton.addEventListener('click', () => minimizeWindow(minimizeButton.closest('.window')));
    }
    if (maximizeButton && restoreButton) {
        maximizeButton.addEventListener('click', () => maximizeWindow(maximizeButton.closest('.window')));
        restoreButton.addEventListener('click', () => restoreFromMaximized(restoreButton.closest('.window')));
    }

    makeWindowDraggable(windowElement);

    windowElement.addEventListener('mousedown', bringToFront);
    windowElement.addEventListener('touchstart', bringToFront);

    titleBar.addEventListener('dblclick', function () {
        const win = this.closest('.window');
        if (win.isMaximized) {
            restoreFromMaximized(win);
        } else {
            maximizeWindow(win);
        }
    });
}

function createTaskbarButton(windowId, iconSrc, title) {
    const taskbarAppArea = document.querySelector('.taskbar-app-area');
    if (!taskbarAppArea) return;

    // Create taskbar button
    const taskbarButton = document.createElement('button');
    taskbarButton.className = 'taskbar-button';
    taskbarButton.setAttribute('for', windowId);

    // Add icon and title
    taskbarButton.innerHTML = `<img src="${iconSrc}" alt="Icon">${title}`;

    // Add click handler for taskbar button (toggle window visibility)
    taskbarButton.addEventListener('click', function (event) {
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

    // Add button to taskbar
    taskbarAppArea.appendChild(taskbarButton);

    return taskbarButton;
}