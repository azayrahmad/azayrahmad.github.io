# Project Cleanup: Resetting to Minima Default

This document details the cleanup performed and provides instructions for final manual steps to fully remove the legacy theme assets.

## Actions Already Performed

1.  **Layout Reset**:
    *   `index.markdown` is reset to `layout: home` and custom HTML/CSS blocks have been removed.
    *   All other pages (`about`, `projects`, `lecturing`, `skills`, `resume`, `posts`, `credits`) now use `layout: page`.
    *   Theme-specific front matter (icons, custom IDs) has been removed.

2.  **Configuration Update**:
    *   `_config.yml` has been updated with a standard site description.
    *   Social media usernames (`twitter_username`, `github_username`, etc.) are now correctly configured for Minima.
    *   The site header navigation order is explicitly defined via `header_pages`.
    *   The theme is set to `minima`.

3.  **Component Removal**:
    *   Custom layouts and includes like `windows.html`, `bootup.html`, `desktop.html`, and `taskbar.html` have been deleted.
    *   `_includes/custom-head.html` has been cleaned up to remove legacy CSS and JS links.

## Final Manual Steps (Recommended)

To save time during the automated process, large asset directories were **not** deleted. You should manually remove them to clean up the repository:

*   **Delete the following directories**:
    *   `win98/`
    *   `clippy/`
    *   `_sass/minima/` (This contains custom overrides; delete the entire `_sass/` folder to use default Minima styles).
    *   `assets/fonts/`

*   **Delete legacy images and files**:
    *   `win98.html`
    *   `indexhtml`
    *   Specialized background images in `assets/img/` that are no longer used (e.g., `computer.png`, `phone.png`).

## Build Instructions

To verify the changes locally:
1.  Run `bundle install` to ensure dependencies are up to date.
2.  Run `bundle exec jekyll serve` to view the site.
3.  The site should now be using the default Minima theme while retaining all your original Markdown content and SEO settings.
