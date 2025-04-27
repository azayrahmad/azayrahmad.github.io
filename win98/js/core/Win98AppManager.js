/**
 * Win98AppManager - Handles application creation and management
 */
const Win98AppManager = (function () {
  // Create and open an application
  function createAndOpenApp(event) {
    const element = event.currentTarget;
    const windowId = element.getAttribute("for");
    // If this is a start menu item without full data, get data from the desktop icon
    let windowTitle, windowIcon, windowContent;

    // If this element has all the data, use it directly
    if (element.hasAttribute("title") && element.hasAttribute("data-icon")) {
      windowTitle = element.getAttribute("title") || "New Window";
      windowIcon =
        element.getAttribute("data-icon") || "/win98/icons/SHELL32_3.ico";
      windowContent = element.getAttribute("data-content") || "";
    }
    // Otherwise, find the corresponding desktop icon and get data from there
    else {
      const desktopIcon = document.querySelector(
        `.desktop-icon[for="${windowId}"]`,
      );
      if (desktopIcon) {
        windowTitle = desktopIcon.getAttribute("title") || "New Window";
        windowIcon =
          desktopIcon.getAttribute("data-icon") || "/win98/icons/SHELL32_3.ico";
        windowContent = desktopIcon.getAttribute("data-content") || "";
      } else {
        // Fallback values if no matching desktop icon is found
        windowTitle = "New Window";
        windowIcon = "/win98/icons/SHELL32_3.ico";
        windowContent = "";
      }
    }

    // Check if window already exists (optional, to prevent duplicates)
    const existingWindow = document.getElementById(windowId);
    if (existingWindow) {
      // If you want to bring existing window to front instead of creating duplicate
      existingWindow.classList.remove("hidden");
      Win98System.incrementZIndex();
      existingWindow.style.zIndex = Win98System.getHighestZIndex();
      Win98WindowManager.updateTitleBarClasses(existingWindow);

      const existingTaskbarButton = document.querySelector(
        `.taskbar-button[for="${windowId}"]`,
      );
      if (existingTaskbarButton) {
        existingTaskbarButton.classList.remove("hidden");
      }
      return;
    }

    // Create new window element
    const content = document.createElement("div");
    content.innerHTML = `${windowContent}`;

    const newWindow = Win98WindowManager.createWindow({
      windowId: windowId,
      windowTitle: `${windowTitle}`,
      windowIcon: `${windowIcon}`,
      contentElement: content,
    });

    const taskbarButton = Win98TaskbarManager.createTaskbarButton(
      windowId,
      windowIcon,
      windowTitle,
    );

    // Setup event listeners for window controls
    Win98WindowManager.setupWindowControls(newWindow, taskbarButton);
    // Update title bar classes to show this as active window
    Win98WindowManager.updateTitleBarClasses(newWindow);
  }

  // Close all applications
  function closeAllApps() {
    const windows = document.querySelectorAll(".app-window");
    windows.forEach((window) => {
      // Get the window ID
      const windowId = window.id;
      // Find and remove the corresponding taskbar button
      const taskbarButton = document.querySelector(
        `.taskbar-button[for="${windowId}"]`,
      );
      if (taskbarButton) {
        taskbarButton.remove();
      }
      // Remove the window
      window.remove();
    });
  }

  // Function to create welcome window content
  function createWelcomeContent() {
    var welcomeContentSource = document.getElementById(
      "welcome-content-source",
    );
    if (!welcomeContentSource) return null;

    const welcomeContent = document.createElement("div");
    welcomeContent.className = "welcome-content";
    welcomeContent.innerHTML = welcomeContentSource.innerHTML;

    // Add 100% width and height
    welcomeContent.style.width = "100%";
    welcomeContent.style.height = "100%";

    return welcomeContent;
  }

  // Function to define the welcomeShowDetail function
  function defineWelcomeDetailHandler() {
    if (!window.welcomeShowDetail) {
      window.welcomeShowDetail = function (detailId) {
        const welcomeWindow = document.getElementById("welcome-window");
        if (!welcomeWindow) return;

        // Get all detail elements and the intro
        const details = welcomeWindow.querySelectorAll(".welcome-detail");
        const welcomeIntro = welcomeWindow.querySelector("#welcome-intro");

        // Hide all details first
        details.forEach((detail) => {
          detail.style.display = "none";
        });

        // If detailId is provided and valid, show that specific detail
        if (detailId) {
          const targetDetail = welcomeWindow.querySelector("#" + detailId);
          if (targetDetail) {
            targetDetail.style.display = "block";
            if (welcomeIntro) welcomeIntro.style.display = "none";
            return;
          }
        }

        // Otherwise show the welcome intro (default behavior)
        if (welcomeIntro) {
          welcomeIntro.style.display = "block";
        }
      };
    }
  }

  // Initialize welcome screen
  function initWelcomeScreen() {
    const welcomeContent = createWelcomeContent();
    if (!welcomeContent) return null;

    defineWelcomeDetailHandler();

    // Create the welcome window
    var welcomeWindow = Win98WindowManager.createWindow({
      windowId: "welcome-window",
      windowTitle: "Welcome to Windows 98",
      windowIcon: "win98/icons/SHELL32_3.ico",
      contentElement: welcomeContent,
      centered: true,
      width: 600,
      height: 400,
    });
    welcomeWindow.style.resize = "none";

    // Create taskbar button for welcome window
    const taskbarButton = Win98TaskbarManager.createTaskbarButton(
      "welcome-window",
      "win98/icons/SHELL32_3.ico",
      "Welcome",
    );

    // Setup event listeners for window controls
    Win98WindowManager.setupWindowControls(welcomeWindow, taskbarButton);
    // Update title bar classes to show this as active window
    Win98WindowManager.updateTitleBarClasses(welcomeWindow);

    // Attach mouseleave event to options panel
    setTimeout(() => {
      const optionsPanel = welcomeWindow.querySelector(".options-panel");
      if (optionsPanel) {
        optionsPanel.addEventListener("mouseleave", function () {
          welcomeShowDetail(); // Call with no arguments to show welcome intro
        });
      }
    }, 600);

    // Show welcome intro
    setTimeout(() => {
      const welcomeIntro = document.querySelector(
        "#welcome-window #welcome-intro",
      );
      if (welcomeIntro) {
        welcomeIntro.style.display = "block";
      }
    }, 500);

    return welcomeWindow;
  }

  // Public API
  return {
    createAndOpenApp,
    closeAllApps,
    initWelcomeScreen,
  };
})();
