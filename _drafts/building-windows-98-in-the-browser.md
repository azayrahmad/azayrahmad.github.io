---

## layout: post title: "Recreating Windows 98 Desktop Themes on the Web"

## Introduction

This article documents the process of recreating Windows 98 desktop themes on the web, from a simple blog styling experiment to a full Progressive Web App that faithfully reproduces the original desktop themes system. It explores how Windows 98 handled themes — including wallpapers, color schemes, cursors, sounds, and screensavers — and how those systems were reconstructed using modern web technologies.

What began as a nostalgic design idea gradually evolved into a deeper engineering project focused on accurately preserving a small but memorable part of computing history.

---

## It was 2002...

I had just returned home for a school break when I noticed a computer in my room — a beige, slightly yellowing Pentium MMX running Windows 98 that my father had bought secondhand for me. I had used computers before, but this was the first personal computer in my family, even though it was already outdated at the time.

The moment I turned it on and saw the bulky CRT glow to life, I became completely obsessed.

Many aspects of computers fascinated me, but one in particular stood out: desktop themes. The audiovisual experience of using a computer made it feel more than just a tool. The ability to personalize it made it feel like mine.

I spent countless hours customizing the look and sound of my computer. I would run screensavers and stare at them for minutes, experiment with wallpapers, change system sounds, and collect desktop theme files from any computer I could access, storing them carefully on stacks of diskettes.

That early fascination with desktop themes stayed with me for years, even as operating systems and computers evolved.

---

## Phase 1: Dressing Up the Blog (March 2025)

Fast forward 23 years later.

By this point, I had been working as a software engineer for over a decade. Like many engineers today, I eventually decided to create a personal website. I built a simple Jekyll blog at [https://azayrahmad.github.io](https://azayrahmad.github.io), containing my CV and several technical articles.

While working on the site, I remembered my childhood experience with Windows 98 desktop themes and thought it would be interesting to express a bit of personality through the website design. The idea was simple: make the website look like Windows 98.

Web development — especially JavaScript-heavy UI work — was not my strongest area, so I relied heavily on LLM tools to generate CSS and JavaScript. Asking tools like Claude or ChatGPT to generate a Windows 98-themed webpage produced working components such as Explorer windows, Notepad, and even Minesweeper.

However, visually it never looked right. The layout worked, the functionality worked, but the overall result still felt like an approximation rather than an authentic recreation.

The breakthrough came when I discovered [**98.css**](https://jdan.github.io/98.css/), a CSS library that faithfully recreates Windows 98 visual styles down to pixel-level accuracy. By integrating its documentation and structure into the AI-assisted workflow, I was able to override the default Jekyll theme and produce a convincing Windows 98-style interface.

I experimented with interactive windows, taskbars, and desktop behavior using generated JavaScript, but complexity quickly grew. By mid-2025, it became clear that forcing this into a Jekyll theme was not the right approach.

The project needed to become something bigger.

---

## Phase 2: A Proper Separate Project (August 2025)

I created a new repository: [**win98-web**](https://github.com/azayrahmad/win98-web).

This started as a standalone HTML project containing a modified 98.css file and JavaScript components refactored from the original blog experiment. Before continuing, I explored existing Windows 9x-inspired web projects to understand the landscape.

Several notable projects already existed:

* [Windows93](https://www.windows93.net/) — an artistic and experimental parody of a web-based OS
* [Windows96](https://windows96.net/) — a web operating system with Windows 9x-inspired visuals
* [98.js.org](https://98.js.org/) — the closest recreation of Windows 98 behavior

Each project took a different approach, but **98.js.org** stood out as the most technically accurate implementation.

Digging deeper into its repository revealed [**os-gui.js**](https://os-gui.js.org/), a library implementing many core Windows interface components and supporting classic Windows color schemes derived from the [**WinClassic project**](https://tpenguinltg.github.io/winclassic/).

Rather than reinventing everything, I decided to integrate os-gui.js with 98.css. This required manually aligning both systems, since they used different approaches to layout, styling, and UI behavior.

During this exploration, an important gap became clear.

While several projects recreated Windows 98 visually and functionally, none implemented the full **Desktop Themes system**.

98.js.org supported extracting color schemes from `.theme` files, but Windows 98 themes were much more than colors. A real desktop theme included:

* wallpapers
* color schemes
* animated `.ani` cursors
* sound event mappings
* icons
* screensavers

All bundled together and applied from a single `.theme` file.

This full system had never been recreated on the web.

That became the focus of the project.

---

## Phase 3: Rebuilding the Themes System

To accurately replicate Windows 98 behavior, I set up a Windows 98 virtual machine using [**86Box**](https://86box.net/). This VM served as both a reference environment and an asset source throughout the project.

86Box stores the virtual hard drive as a `.vhd` file, which can be mounted directly in Windows 11, making it easy to browse the original system files.

By this stage, the web application already had a functional desktop environment:

* windowing system
* taskbar
* basic applications like Notepad and Clippy
* color scheme support from os-gui

The next step was implementing real desktop themes.

### Theme File Parsing

Windows 98 `.theme` files are plaintext INI configuration files that reference asset paths. Once extracted from the VM, they were straightforward to parse and map into a JavaScript configuration system.

The associated assets were located in:

```
C:\Program Files\Plus!\Themes
```

These included wallpapers, sounds, cursors, and icons.

Color schemes were integrated into the existing CSS variable system from os-gui.js, allowing themes to dynamically update the UI appearance.

### Animated Cursors

Windows 98 uses the `.ani` animated cursor format.

The [**ani-cursor**](https://github.com/nicowillis/ani-cursor) library made it possible to load and render these cursors directly in the browser, enabling authentic animated pointer behavior.

### Screensavers

Screensavers were the most challenging part.

While several classic Windows screensavers had already been recreated as web projects, such as:

* [3D Pipes](https://github.com/1j01/pipes)
* [3D Maze](https://github.com/ibid-11962/Windows-95-3D-Maze-Screensaver)
* [3D FlowerBox](https://github.com/kevin-shannon/3D-FlowerBox)

none of the Microsoft Plus! theme screensavers were available.

To solve this, I extracted sprite and sound assets directly from the original `.scr` binaries using [**Resource Hacker**](http://www.angusj.com/resourcehacker/).

The animation logic was reconstructed through observation:

* running screensavers inside the VM
* recording their behavior
* studying frame timing and motion
* recreating animations in HTML/CSS/JavaScript

This process was slow and manual, but it allowed accurate reconstruction.

At the time of writing, the Space and Underwater screensavers have been successfully recreated.

### Display and Desktop Themes Programs

Windows 98 originally provided a Display Properties panel for configuring wallpapers, color schemes, and screensavers.

Microsoft Plus! later introduced a dedicated Desktop Themes program with theme previews and icon sets.

Both interfaces were recreated in win98-web to closely match the original experience.

---

## Technical Highlights

* Full Windows 98 `.theme` file parser
* Wallpaper, color scheme, cursor, and sound integration
* Animated `.ani` cursor support
* Screensaver reconstruction from original assets
* Integration of 98.css and os-gui.js
* VM-based reverse engineering workflow
* Progressive Web App support
* Application development guide for extensions

---

## Lessons Learned

**1. Visual accuracy requires real reference material**
AI-generated approximations are useful, but authentic UI recreation requires studying the original system.

**2. Old systems are simple but tightly integrated**
Windows 98 themes were not complex individually, but the integration between assets created a cohesive experience.

**3. Reverse engineering through observation works**
Watching behavior and reconstructing it step by step can be more effective than relying on incomplete documentation.

**4. Small nostalgic ideas can evolve into serious engineering projects**
What started as a blog decoration became a full desktop themes recreation system.

---

## Where It Stands

[**Windows 98 Web Edition**](https://azayrahmad.github.io/win98-web/) is now a Progressive Web App that can be installed on desktop, MIT licensed, and designed to be extensible.

It includes:

* full desktop environment
* desktop themes system
* classic Windows programs
* screensavers
* application development guide
* Disk Defragmenter simulator

What started as a simple attempt to decorate a blog eventually turned into a faithful recreation of Windows 98 desktop themes on the web.

In the end, this project became less about nostalgia and more about preserving a small piece of computing history using modern web technologies.

---

**Source:** [https://github.com/azayrahmad/win98-web](https://github.com/azayrahmad/win98-web)
**Live Demo:** [https://azayrahmad.github.io/win98-web/](https://azayrahmad.github.io/win98-web/)
