document.addEventListener("DOMContentLoaded", function () {
  const bootScreen = document.getElementById("boot-screen");
  const gifScreen = document.getElementById("gif-screen");
  const progress = document.getElementById("progress");
  const assetList = document.getElementById("asset-list");
  const bootSound = document.getElementById("boot-sound");
  const appContainer = document.getElementById("app-container");

  function getAssets() {
    let assets = [];
    document
      .querySelectorAll("script[src], link[rel='stylesheet'], img[src]")
      .forEach((el) => {
        assets.push(el.src || el.href);
      });
    return assets;
  }

  let assets = getAssets();
  let loaded = 0;

  function updateProgress(asset) {
    loaded++;
    progress.textContent = `Loaded ${loaded} of ${assets.length} assets...`;
    if (asset) {
      const assetItem = document.createElement("div");
      assetItem.textContent = `✔ ${asset}`;
      assetList.appendChild(assetItem);
    }
    if (loaded >= assets.length) {
      // continueText.classList.remove("hidden");
      // document.addEventListener("keydown", proceedToGifScreen);
      // document.addEventListener("click", proceedToGifScreen);
      proceedToGifScreen();
    }
  }

  function loadAssets() {
    if (assets.length === 0) {
      updateProgress();
      return;
    }

    assets.forEach((asset) => {
      let el;
      if (asset.endsWith(".js")) {
        el = document.createElement("script");
        el.src = asset;
      } else if (asset.endsWith(".css")) {
        el = document.createElement("link");
        el.rel = "stylesheet";
        el.href = asset;
      } else {
        el = new Image();
        el.src = asset;
      }
      el.onload = () => updateProgress(asset);
      el.onerror = () => updateProgress(asset + " (failed)");
      document.head.appendChild(el);
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

  // Function to initialize the welcome window
  function initializeWelcomeWindow() {
    const welcomeContent = createWelcomeContent();
    if (!welcomeContent) return null;

    defineWelcomeDetailHandler();

    // Create the welcome window
    var welcomeWindow = createAppWindow({
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
    const taskbarButton = createTaskbarButton(
      "welcome-window",
      "win98/icons/SHELL32_3.ico",
      "Welcome",
    );

    // Setup event listeners for window controls
    setupWindowControls(welcomeWindow, taskbarButton);
    // Update title bar classes to show this as active window
    updateTitleBarClasses(welcomeWindow);

    // Attach mouseleave event to options panel
    setTimeout(() => {
      const optionsPanel = welcomeWindow.querySelector(".options-panel");
      if (optionsPanel) {
        optionsPanel.addEventListener("mouseleave", function () {
          welcomeShowDetail(); // Call with no arguments to show welcome intro
        });
      }
    }, 600);

    return welcomeWindow;
  }

  // Function to show the welcome intro
  function showWelcomeIntro() {
    setTimeout(() => {
      const welcomeIntro = document.querySelector(
        "#welcome-window #welcome-intro",
      );
      if (welcomeIntro) {
        welcomeIntro.style.display = "block";
      }
    }, 500);
  }

  function proceedToGifScreen() {
    bootScreen.style.display = "none";
    gifScreen.classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("gif-screen").classList.add("hidden");
      document.getElementById("login-screen").classList.remove("hidden");
    }, 2000);

    document
      .getElementById("login-form")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        username = document.getElementById("username").value;
        logofftext = document.getElementById("logofftext");
        logofftext.textContent = `Log Off ${username}...`;

        // Add event listener to logoff text
        logofftext.addEventListener("click", function () {
          closeAllWindows();
          appContainer.classList.add("hidden");
          document.getElementById("login-screen").classList.remove("hidden");
          document.getElementById("username").value = ""; // Clear the username field
        });

        document.getElementById("login-screen").classList.add("hidden");
        bootSound.play();

        // Initialize welcome window with modular functions
        const welcomeWindow = initializeWelcomeWindow();
        if (welcomeWindow) {
          showWelcomeIntro();
        }

        appContainer.classList.remove("hidden");
      });
  }

  loadAssets();

  // Function to close all windows
  function closeAllWindows() {
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
});
