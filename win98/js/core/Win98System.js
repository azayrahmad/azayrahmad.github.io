/**
 * Win98System - Core system functionality and utilities
 */
const Win98System = (function () {
  // Private variables
  let _state = {
    highestZIndex: 100,
    assets: [],
    loaded: 0,
    isBooted: false,
    username: null,
  };

  // Utility functions
  function getPointerCoords(e) {
    if (e.touches && e.touches.length) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function animateTransition(
    element,
    targetStyles,
    callback,
    transitionSpec = "left 0.25s ease, top 0.25s ease, width 0.25s ease",
  ) {
    element.style.transition = transitionSpec;
    // Force reflow so the transition applies immediately
    element.offsetWidth;
    Object.entries(targetStyles).forEach(([prop, value]) => {
      element.style[prop] = value;
    });
    element.addEventListener("transitionend", function handler() {
      element.removeEventListener("transitionend", handler);
      callback();
    });
  }

  // Boot process functions
  function getAssets() {
    let assets = [];
    document
      .querySelectorAll("script[src], link[rel='stylesheet'], img[src]")
      .forEach((el) => {
        assets.push(el.src || el.href);
      });
    return assets;
  }

  function updateProgress(asset) {
    const progress = document.getElementById("progress");
    const assetList = document.getElementById("asset-list");

    _state.loaded++;
    if (progress) {
      progress.textContent = `Loaded ${_state.loaded} of ${_state.assets.length} assets...`;
    }

    if (asset && assetList) {
      const assetItem = document.createElement("div");
      assetItem.textContent = `✔ ${asset}`;
      assetList.appendChild(assetItem);
    }

    if (_state.loaded >= _state.assets.length) {
      proceedToGifScreen();
    }
  }

  function loadAssets() {
    _state.assets = getAssets();

    if (_state.assets.length === 0) {
      updateProgress();
      return;
    }

    _state.assets.forEach((asset) => {
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

  function proceedToGifScreen() {
    const bootScreen = document.getElementById("boot-screen");
    const gifScreen = document.getElementById("gif-screen");

    if (bootScreen && gifScreen) {
      bootScreen.style.display = "none";
      gifScreen.classList.remove("hidden");

      setTimeout(() => {
        gifScreen.classList.add("hidden");
        document.getElementById("login-screen").classList.remove("hidden");
      }, 2000);

      setupLoginHandler();
    }
  }

  function setupLoginHandler() {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        _state.username = document.getElementById("username").value;
        const logofftext = document.getElementById("logofftext");
        if (logofftext) {
          logofftext.textContent = `Log Off ${_state.username}...`;

          logofftext.addEventListener("click", function () {
            Win98AppManager.closeAllApps();
            document.getElementById("app-container").classList.add("hidden");
            document.getElementById("login-screen").classList.remove("hidden");
            document.getElementById("username").value = "";
          });
        }

        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("boot-sound").play();

        // Initialize welcome window
        Win98AppManager.initWelcomeScreen();

        document.getElementById("app-container").classList.remove("hidden");
      });
    }
  }

  // Public API
  return {
    // Public state properties
    getHighestZIndex() {
      return _state.highestZIndex;
    },

    incrementZIndex() {
      return ++_state.highestZIndex;
    },

    setHighestZIndex(value) {
      _state.highestZIndex = value;
    },

    getUsername() {
      return _state.username;
    },

    // Core boot function
    boot() {
      return new Promise((resolve) => {
        loadAssets();
        // This is a bit of a hack since we're not properly handling the async
        // nature of the boot process in the original code
        setTimeout(resolve, 1000);
      });
    },

    // Utility functions exposed publicly
    utils: {
      getPointerCoords,
      animateTransition,
    },
  };
})();
