/**
 * Win98WindowManager - Handles window creation and management
 */
const Win98WindowManager = (function () {
  // Private helper functions
  function createTitleBarCopy(titleBar, rect) {
    const copy = titleBar.cloneNode(true);
    const controls = copy.querySelector(".title-bar-controls");
    if (controls) controls.remove();
    copy.style.position = "fixed";
    copy.style.left = rect.left + "px";
    copy.style.top = rect.top + "px";
    copy.style.width = rect.width + "px";
    copy.style.zIndex = Win98System.getHighestZIndex() + 1;
    copy.classList.remove("inactive");
    return copy;
  }

  function updateWindowControls(win) {
    const maximizeBtn = win.querySelector(
      '.title-bar-controls button[aria-label="Maximize"]',
    );
    const restoreBtn = win.querySelector(
      '.title-bar-controls button[aria-label="Restore"]',
    );

    if (win.isMaximized) {
      maximizeBtn.style.display = "none";
      restoreBtn.style.display = "inline-block";
      win.style.resize = "none";
    } else {
      maximizeBtn.style.display = "inline-block";
      restoreBtn.style.display = "none";
      win.style.resize = "both";
    }
  }

  // Public methods
  function createWindow({
    windowId,
    windowTitle,
    windowIcon,
    contentElement,
    centered = false,
    width,
    height,
  }) {
    const newWindow = document.createElement("div");
    newWindow.id = windowId;
    newWindow.className = "window app-window";

    // Position the window with slight randomization for cascade effect
    const topPosition = 30 + Math.random() * 60;
    const leftPosition = 50 + Math.random() * 100;
    newWindow.style.top = `${topPosition}px`;
    newWindow.style.left = `${leftPosition}px`;

    // Apply width and height only if provided
    if (width !== undefined) {
      newWindow.style.width = typeof width === "number" ? `${width}px` : width;
    }
    if (height !== undefined) {
      newWindow.style.height =
        typeof height === "number" ? `${height}px` : height;
    }

    // If centered is true and both width and height are provided, center the window
    if (centered && width !== undefined && height !== undefined) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const xPosition = (windowWidth - parseInt(width)) / 2;
      const yPosition = (windowHeight - parseInt(height)) / 2;
      newWindow.style.left = `${xPosition}px`;
      newWindow.style.top = `${yPosition}px`;
    }

    // Set highest z-index
    Win98System.incrementZIndex();
    newWindow.style.zIndex = Win98System.getHighestZIndex();

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
    const contentContainer = newWindow.querySelector(".window-content");
    if (contentElement) {
      contentContainer.appendChild(contentElement);
    }

    // Add to document
    document.body.appendChild(newWindow);

    return newWindow;
  }

  function setupWindowControls(windowElement, taskbarButton) {
    const titleBar = windowElement.querySelector(".title-bar");
    const closeButton = windowElement.querySelector(
      'button[aria-label="Close"]',
    );
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        windowElement.remove();
        taskbarButton.remove();
      });
    }

    const minimizeButton = windowElement.querySelector(
      'button[aria-label="Minimize"]',
    );
    const maximizeButton = windowElement.querySelector(
      'button[aria-label="Maximize"]',
    );
    const restoreButton = windowElement.querySelector(
      'button[aria-label="Restore"]',
    );

    if (minimizeButton) {
      minimizeButton.addEventListener("click", () =>
        minimizeWindow(minimizeButton.closest(".window")),
      );
    }
    if (maximizeButton && restoreButton) {
      maximizeButton.addEventListener("click", () =>
        maximizeWindow(maximizeButton.closest(".window")),
      );
      restoreButton.addEventListener("click", () =>
        restoreFromMaximized(restoreButton.closest(".window")),
      );
    }

    makeWindowDraggable(windowElement);

    windowElement.addEventListener("mousedown", bringToFront);
    windowElement.addEventListener("touchstart", bringToFront);

    titleBar.addEventListener("dblclick", function () {
      const win = this.closest(".window");
      if (win.isMaximized) {
        restoreFromMaximized(win);
      } else {
        maximizeWindow(win);
      }
    });
  }

  function makeWindowDraggable(win) {
    const titleBar = win.querySelector(".title-bar");
    const desktopArea = document.querySelector(".desktop-area");
    let offsetX,
      offsetY,
      isDragging = false;
    let dragOutline = null;
    let startCoords = null,
      initialRect = null;
    const dragThreshold = 5; // pixels

    function startDragging(e) {
      // Do not start dragging if clicking controls
      if (e.target.closest(".title-bar-controls")) return;
      if (win.isMaximized) return;

      const desktopRect = desktopArea.getBoundingClientRect();
      const pointerCoords = Win98System.utils.getPointerCoords(e);

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
      const currentCoords = Win98System.utils.getPointerCoords(e);

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
        dragOutline = document.createElement("div");
        dragOutline.style.position = "absolute";
        dragOutline.style.border = "4px solid black";
        dragOutline.style.boxSizing = "border-box";
        dragOutline.style.width = initialRect.width + "px";
        dragOutline.style.height = initialRect.height + "px";
        dragOutline.style.left = initialRect.left + "px";
        dragOutline.style.top = initialRect.top + "px";
        dragOutline.style.pointerEvents = "none";
        Win98System.incrementZIndex();
        win.style.zIndex = Win98System.getHighestZIndex();
        dragOutline.style.zIndex = Win98System.getHighestZIndex() + 1;
        win.parentElement.appendChild(dragOutline);
      }
      if (dragOutline) {
        dragOutline.style.left = currentCoords.x - offsetX + "px";
        dragOutline.style.top = currentCoords.y - offsetY + "px";
      }
    }

    function stopDragging() {
      if (!isDragging) return;
      isDragging = false;

      if (dragOutline) {
        // Get initial dimensions to preserve
        const initialWidth = win.offsetWidth;

        // Position the window
        win.style.position = "absolute";
        win.style.left = dragOutline.style.left;
        win.style.top = dragOutline.style.top;

        // Ensure width is preserved
        win.style.width = initialWidth + "px";

        // Remove outline
        dragOutline.parentElement.removeChild(dragOutline);
        dragOutline = null;
      }
    }

    titleBar.addEventListener("mousedown", startDragging);
    titleBar.addEventListener("touchstart", startDragging);
    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchend", stopDragging);
  }

  function bringToFront() {
    Win98System.incrementZIndex();
    this.style.zIndex = Win98System.getHighestZIndex();
    updateTitleBarClasses(this);
  }

  function deactivateAllWindows(event) {
    if (!event.target.closest(".window")) {
      document.querySelectorAll(".window").forEach((win) => {
        const titleBar = win.querySelector(".title-bar");
        const taskbarButton = document.querySelector(
          `.taskbar-button[for="${win.id}"]`,
        );

        if (titleBar) {
          titleBar.classList.add("inactive");
        }
        if (taskbarButton) {
          taskbarButton.classList.remove("active");
        }
      });

      if (event.target.closest(".desktop")) {
        // Remove highlight from all icons and icon-labels
        document
          .querySelectorAll(
            ".desktop-icon .icon img, .desktop-icon .icon-label",
          )
          .forEach((element) => {
            element.classList.remove("highlighted-icon", "highlighted-label");
          });
      } else {
        // Remove highlight from all icons and icon-labels
        document
          .querySelectorAll(
            ".desktop-icon .icon img, .desktop-icon .icon-label",
          )
          .forEach((element) => {
            element.classList.remove(
              "highlighted-icon",
              "highlighted-label",
              "selected",
            );
          });
      }
    } else {
      // Remove highlight from all icons and icon-labels
      document
        .querySelectorAll(".desktop-icon .icon img, .desktop-icon .icon-label")
        .forEach((element) => {
          element.classList.remove(
            "highlighted-icon",
            "highlighted-label",
            "selected",
          );
        });
    }
  }

  function updateTitleBarClasses(activeWindow) {
    document.querySelectorAll(".window").forEach((win) => {
      const titleBar = win.querySelector(".title-bar");
      const taskbarButton = document.querySelector(
        `.taskbar-button[for="${win.id}"]`,
      );
      if (titleBar || taskbarButton) {
        if (win === activeWindow) {
          if (titleBar) titleBar.classList.remove("inactive");
          if (taskbarButton) taskbarButton.classList.add("active");
        } else {
          if (titleBar) titleBar.classList.add("inactive");
          if (taskbarButton) taskbarButton.classList.remove("active");
        }
      }
    });
  }

  function minimizeWindow(win, withoutAnimation = false) {
    if (win.isMinimized) return;
    const titleBar = win.querySelector(".title-bar");
    // Capture original dimensions
    win.originalTitleBarRect = titleBar.getBoundingClientRect();
    if (!win.isMaximized) win.originalWindowRect = win.getBoundingClientRect();

    const titleBarCopy = createTitleBarCopy(titleBar, win.originalTitleBarRect);
    document.body.appendChild(titleBarCopy);

    // Animate to taskbar button target
    const btn = document.querySelector(`.taskbar-button[for="${win.id}"]`);
    const btnRect = btn.getBoundingClientRect();

    if (withoutAnimation) {
      win.style.display = "none";
      btn.classList.remove("active");
      titleBarCopy.remove();
      win.isMinimized = true;
    } else {
      Win98System.utils.animateTransition(
        titleBarCopy,
        {
          left: btnRect.left + "px",
          top: btnRect.top + "px",
          width: btnRect.width + "px",
        },
        function () {
          win.style.display = "none";
          btn.classList.remove("active");
          titleBarCopy.remove();
          win.isMinimized = true;
        },
      );
    }
  }

  function restoreWindow(win) {
    if (!win.isMinimized) return;
    const titleBar = win.querySelector(".title-bar");

    const btn = document.querySelector(`.taskbar-button[for="${win.id}"]`);
    const btnRect = btn.getBoundingClientRect();
    titleBar.classList.remove("inactive");
    btn.classList.add("active");

    const titleBarCopy = createTitleBarCopy(titleBar, btnRect);
    document.body.appendChild(titleBarCopy);

    Win98System.utils.animateTransition(
      titleBarCopy,
      {
        left: win.originalTitleBarRect.left + "px",
        top: win.originalTitleBarRect.top + "px",
        width: win.originalTitleBarRect.width + "px",
      },
      function () {
        win.style.display = "";
        titleBarCopy.remove();
        win.isMinimized = false;
        // Restore window position using its stored rect if available
        if (!win.isMaximized && win.originalWindowRect) {
          win.style.position = "absolute";
          win.style.left = win.originalWindowRect.left + "px";
          win.style.top = win.originalWindowRect.top + "px";
          win.style.width = win.originalWindowRect.width + "px";
        }
      },
    );
  }

  function maximizeWindow(win) {
    if (win.isMaximized) return;

    const titleBar = win.querySelector(".title-bar");
    const windowContent = win.querySelector(".window-content");
    const desktopArea = document.getElementById("desktop-area");

    // Store original dimensions for later restoration
    win.originalTitleBarRect = titleBar.getBoundingClientRect();
    win.originalWindowRect = win.getBoundingClientRect();

    const titleBarCopy = createTitleBarCopy(titleBar, win.originalTitleBarRect);
    document.body.appendChild(titleBarCopy);

    // Get desktop area dimensions
    const desktopRect = desktopArea.getBoundingClientRect();

    Win98System.utils.animateTransition(
      titleBarCopy,
      {
        left: desktopRect.left + "px",
        top: desktopRect.top + "px",
        width: desktopRect.width + "px",
      },
      function () {
        // Get window computed styles to account for borders
        const computedStyle = window.getComputedStyle(win);
        const borderTopWidth = parseInt(computedStyle.borderTopWidth, 10) || 0;
        const borderRightWidth =
          parseInt(computedStyle.borderRightWidth, 10) || 0;
        const borderBottomWidth =
          parseInt(computedStyle.borderBottomWidth, 10) || 0;
        const borderLeftWidth =
          parseInt(computedStyle.borderLeftWidth, 10) || 0;

        // Calculate dimensions that will fit inside desktop area
        const adjustedWidth =
          desktopRect.width - borderLeftWidth - borderRightWidth;
        const adjustedHeight =
          desktopRect.height - borderTopWidth - borderBottomWidth;

        // Set window position and size to fit exactly within desktop area
        win.style.position = "absolute";
        win.style.left = borderLeftWidth + "px";
        win.style.top = borderTopWidth + "px";
        win.style.width = adjustedWidth + "px";
        win.style.height = adjustedHeight + "px";

        // Make sure the window is a direct child of desktop area for proper positioning
        if (win.parentElement !== desktopArea) {
          desktopArea.appendChild(win);
        }

        win.isMaximized = true;
        updateWindowControls(win);
        titleBarCopy.remove();
      },
    );
  }

  function restoreFromMaximized(win) {
    if (!win.isMaximized) return;

    const titleBar = win.querySelector(".title-bar");
    const windowContent = win.querySelector(".window-content");
    const desktopArea = document.getElementById("desktop-area");
    const desktopRect = desktopArea.getBoundingClientRect();
    const titleBarCopy = createTitleBarCopy(titleBar, {
      left: desktopRect.left,
      top: desktopRect.top,
      width: desktopRect.width,
    });
    document.body.appendChild(titleBarCopy);

    Win98System.utils.animateTransition(
      titleBarCopy,
      {
        left: win.originalWindowRect.left + "px",
        top: win.originalWindowRect.top + "px",
        width: win.originalWindowRect.width + "px",
      },
      function () {
        // Move window back to the desktop container (not the desktop-area)
        document.querySelector(".desktop").appendChild(win);

        // Restore original position and size
        win.style.position = "absolute";
        win.style.left = win.originalWindowRect.left + "px";
        win.style.top = win.originalWindowRect.top + "px";
        win.style.width = win.originalWindowRect.width + "px";
        win.style.height = win.originalWindowRect.height + "px";

        win.isMaximized = false;
        updateWindowControls(win);
        titleBarCopy.remove();
      },
    );
  }

  // Initialize window behavior
  function init() {
    // Set up event listeners for deactivating windows
    document.addEventListener("mousedown", deactivateAllWindows);
    document.addEventListener("touchstart", deactivateAllWindows);

    // Make existing windows draggable
    document.querySelectorAll(".window").forEach((win) => {
      makeWindowDraggable(win);
      win.addEventListener("mousedown", bringToFront);
      win.addEventListener("touchstart", bringToFront);
    });

    // Set up double-click handlers for title bars
    document.querySelectorAll(".title-bar").forEach((titleBar) => {
      titleBar.addEventListener("dblclick", function () {
        const win = this.closest(".window");
        if (win.isMaximized) {
          restoreFromMaximized(win);
        } else {
          maximizeWindow(win);
        }
      });
    });

    // Set up window controls
    document
      .querySelectorAll('.title-bar-controls button[aria-label="Close"]')
      .forEach((button) => {
        button.addEventListener("click", function () {
          const win = this.closest(".window");
          const windowId = win.id;
          const taskbarButton = document.querySelector(
            `.taskbar-button[for="${windowId}"]`,
          );

          win.remove();
          if (taskbarButton) taskbarButton.remove();
        });
      });

    document
      .querySelectorAll('.title-bar-controls button[aria-label="Minimize"]')
      .forEach((button) => {
        button.addEventListener("click", () =>
          minimizeWindow(button.closest(".window")),
        );
      });

    document
      .querySelectorAll('.title-bar-controls button[aria-label="Maximize"]')
      .forEach((button) => {
        button.addEventListener("click", () =>
          maximizeWindow(button.closest(".window")),
        );
      });

    document
      .querySelectorAll('.title-bar-controls button[aria-label="Restore"]')
      .forEach((button) => {
        button.addEventListener("click", () =>
          restoreFromMaximized(button.closest(".window")),
        );
      });
  }

  // Public API
  return {
    createWindow,
    setupWindowControls,
    bringToFront,
    makeWindowDraggable,
    minimizeWindow,
    restoreWindow,
    maximizeWindow,
    restoreFromMaximized,
    updateTitleBarClasses,
    deactivateAllWindows,
    init,
  };
})();
