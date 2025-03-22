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