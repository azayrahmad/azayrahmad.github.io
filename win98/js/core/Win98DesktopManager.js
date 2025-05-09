/**
 * Win98DesktopManager - Handles desktop icons and desktop interactions
 */
const Win98DesktopManager = (function () {
  // Set up desktop icons
  function setupIcons() {
    document.querySelectorAll(".desktop-icon").forEach((icon) => {
      // Set up icon click to highlight
      icon.addEventListener("click", function () {
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

        // Add highlight to the clicked icon and icon-label
        const iconImg = this.querySelector(".icon img");
        const iconLabel = this.querySelector(".icon-label");
        if (iconImg) {
          iconImg.classList.add("highlighted-icon");
        }
        if (iconLabel) {
          iconLabel.classList.add("highlighted-label");
          iconLabel.classList.add("selected");
        }
      });

      // Double-click to open app
      icon.addEventListener("dblclick", function (event) {
        Win98AppManager.createAndOpenApp(event);
      });
    });
  }

  // Initialize desktop behavior
  function init() {
    setupIcons();

    // Additional desktop functionality can be added here
  }

  // Public API
  return {
    setupIcons,
    init,
  };
})();
