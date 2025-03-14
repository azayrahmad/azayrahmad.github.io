document.addEventListener("DOMContentLoaded", function () {
    const bootScreen = document.getElementById("boot-screen");
    const gifScreen = document.getElementById("gif-screen");
    const progress = document.getElementById("progress");
    const assetList = document.getElementById("asset-list");
    const bootSound = document.getElementById("boot-sound");
    const appContainer = document.getElementById("app-container");

    function getAssets() {
        let assets = [];
        document.querySelectorAll("script[src], link[rel='stylesheet'], img[src]").forEach(el => {
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

        assets.forEach(asset => {
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
        // document.removeEventListener("keydown", proceedToGifScreen);
        // document.removeEventListener("click", proceedToGifScreen);
        bootScreen.style.display = "none";
        gifScreen.classList.remove("hidden");
        setTimeout(() => {
            document.getElementById("gif-screen").classList.add("hidden");
            document.getElementById("login-screen").classList.remove("hidden");
        }, 2000);

        document.getElementById("login-form").addEventListener("submit", function (e) {
            e.preventDefault();
            // Optionally, add validation or authentication code here

            // Redirect to the main page (change "index.html" to your target)

            document.getElementById("login-screen").classList.add("hidden");
            bootSound.play();
            appContainer.classList.remove("hidden");
        });
    }

    loadAssets();
});
