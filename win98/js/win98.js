/**
 * Main initialization script for Windows 98 UI
 */
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all modules in the correct order
  Win98System.boot().then(() => {
    // Initialize window management
    Win98WindowManager.init();

    // Initialize taskbar
    Win98TaskbarManager.init();

    // Initialize desktop
    Win98DesktopManager.init();

    console.log("Windows 98 UI successfully initialized");
  });
});
