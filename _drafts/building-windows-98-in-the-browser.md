---
layout: post
title: "Building Windows 98 in the Browser: A Year-Long Rabbit Hole"
---

Last March I set out to give my personal blog a Windows 98 makeover. A year later, in March 2026, I had built something I hadn't planned: a standalone browser recreation of the Windows 98 desktop, complete with working applications, the original desktop themes, animated screensavers rebuilt from extracted assets, a real in-browser file system, and a DOS emulator. This is how that happened.

---

## Where It Started

I grew up in Riau, Indonesia in the early 2000s using a secondhand Pentium MMX running Windows 98. What I remember most isn't any particular game or application — it's the Desktop Themes. Windows 98 shipped with a theming system that rewrote the entire environment at once: wallpaper, window colors, cursor sets, sound events, all bundled together. I spent hours switching between them and downloading new ones from the internet. Science themes, nature themes, movie tie-ins. Each one made the machine feel like a different place.

That detail matters later.

---

## Phase 1: Dressing Up the Blog (March 2025)

The original idea was simple: style my Jekyll blog at [azayrahmad.github.io](https://azayrahmad.github.io) to look like Windows 98. I'm a software engineer with a C# background, so JavaScript is not my native territory — I leaned on Claude and ChatGPT to help with the CSS and JS work from the start.

The first significant find was **[98.css](https://jdan.github.io/98.css/)**, a CSS library that recreates the Windows 98 visual language. What's notable about it isn't just the aesthetic accuracy — it's the semantic approach. You write standard HTML with the right class names and get correct Windows 98 window chrome, button states, and borders. Someone had thought carefully about how Windows 98 actually organized its components, not just what it looked like.

For interactive behavior — draggable windows, working minimize/maximize/close buttons, a taskbar — I found **[os-gui.js](https://os-gui.js.org/)** after attempting to build the same thing myself. It was doing what I'd attempted, and doing it better. I switched without hesitation.

The Jekyll approach eventually hit a wall. Overriding a theme on top of a theme creates compounding complexity, and that complexity is particularly costly when AI tools are part of your workflow — they work better with clean, explicit structure. By mid-2025 I decided to start from scratch.

---

## Phase 2: A Proper Separate Project (August 2025)

I opened a new repository — [win98-web](https://github.com/azayrahmad/win98-web) — as a standalone project built with vanilla JavaScript, HTML, CSS, and Vite. No framework, no inherited opinions.

Before building anything substantial, I surveyed the landscape. Browser-based Windows 98 recreations already exist: [windows93.net](https://www.windows93.net/), [Windows 96](https://windows96.net/), [98.js.org](https://98.js.org/), and [1j01/98](https://github.com/1j01/98) are the most notable. Each takes a different approach — Windows 96 is a serious technical recreation, 98.js is a faithful GUI clone, windows93 is more of an art project, and 1j01/98 is a polished open-source desktop recreation. All worth knowing about.

None of them had a complete Desktop Themes implementation. The closest is 1j01/98, which supports color schemes and wallpapers — the same foundation os-gui.js provides, and the same foundation my project builds on. What nobody had done was the full bundle: wallpapers, animated `.ani` cursor sets, and sound event mappings all applying together from a single `.theme` file, the way Windows 98 actually shipped them. That was the gap, and it was the gap I cared about personally. So that's where I started.

---

## Rebuilding the Themes System

This required going back to the source material. I set up a Windows 98 virtual machine and used it as both a reference environment and an asset mine throughout the whole project.

The `.theme` files themselves are plaintext INI configuration files that point to asset paths — straightforward to parse once extracted. The associated wallpapers, icon sets, and sound files came out of the VM directly. For color schemes, I integrated with the existing CSS variable system from os-gui.js. For cursors, Windows 98 uses the `.ani` animated cursor format, which the **[ani-cursor](https://github.com/nicowillis/ani-cursor)** library handles cleanly.

Screensavers were a more interesting problem. Five of the classic animated ones — including the legendary 3D Pipes, 3D Maze, Space, and Underwater — were painstakingly reconstructed. For the Plus! themes, I extracted sprite and sound assets directly from the original `.scr` binaries using **[Resource Hacker](http://www.angusj.com/resourcehacker/)**. The animation logic I reconstructed by observation: running the screensavers in the VM, watching recordings of them on YouTube, rebuilding the behavior in HTML/CSS/JS until it matched what I was seeing. Not reverse-engineering the compiled code — more like transcribing a performance.

The result is a themes system that fully supports the Windows 95 Plus! themes that shipped as defaults in Windows 98 — correct wallpapers, cursor sets, sounds, and color schemes applied together from a single `.theme` file. Windows 98 Plus! themes are partially supported; there are additional customization targets in those theme files that the current system doesn't yet handle. Users can also upload their own `.theme` files.

---

## The AI Development Workflow

Around this time I started using **[Google Jules](https://jules.google.com/)** alongside other AI tools, and it changed how I worked on the project.

Jules is an asynchronous AI coding agent that operates directly on GitHub repositories. You describe a task, it writes the code and opens a pull request, and you review and merge or revise. The repository now has nearly 200 commits and dozens of pull requests, with a significant majority of those contributions coming from Jules.

My workflow became: define a feature at the architectural level — data model, expected behavior, edge cases — then hand the implementation to Jules and come back to review the results. I'd test the output against the real Windows 98 interface using the VM, and either merge it, request changes, or make manual edits where the output didn't meet the accuracy bar.

The language gap between C# and JavaScript is real, but ten years of systems development gives you something more transferable than syntax: you know what well-structured code looks like, you understand type systems and abstraction boundaries, and you know when something has been designed versus bolted together. Reviewing Jules's JavaScript output through that lens isn't fundamentally different from reviewing a colleague's code in an unfamiliar codebase. I could focus on architecture, edge-case definition, and quality assessment — areas where my background is strongest — while delegating implementation. Solitaire, Minesweeper, FreeCell, Notepad, Calculator, and the Command Prompt were all built primarily through this loop.

Where accuracy demanded close attention — screensaver animation, theme parsing, file system work — I stayed more hands-on, using Jules for specific sub-tasks rather than whole features.

---

## Going Deeper: ZenFS and DOS Games

The original Windows Explorer used localStorage for persistence. It works, but it doesn't behave like a real file system — no real directory hierarchy, no file metadata.

I replaced it with **[ZenFS](https://github.com/zen-fs/core)**, which implements proper filesystem semantics in the browser. That change made something else possible: linking the file system to a DOS emulator. Using **[js-dos](https://js-dos.com/)**, users can upload `.exe` files into the virtual file system and run them directly in the browser. The included games — DOOM, Commander Keen, and Diablo — are the original shareware releases distributed freely by their publishers; Prince of Persia runs via an embedded port hosted separately as an open-source web recreation. Anything else can be added through Windows Explorer.

It turned the project from a visual recreation into something with a bit more depth to it.

Other applications worth mentioning: Clippy, rebuilt via [clippyjs](https://github.com/pi0/clippyjs) and extended with an AI backend — a lightweight serverless API hosted on Vercel, currently using Gemini but compatible with any OpenAI API-compatible model — that can actually answer questions about Windows 98; Internet Explorer, which includes a "Retro Mode" that serves archived 1998-era sites via the Wayback Machine; Winamp, embedded via the [Webamp](https://webamp.org/) port; Space Cadet Pinball; and an App Maker tool for building custom applications without touching the source code.

---

## On Accuracy

I used the VM constantly throughout the project — not just for asset extraction but for visual comparison, checking that window chrome, icon sizes, font rendering, and interaction states all matched the real thing. Functional behavior is covered by Playwright tests, the majority of which were written by Jules as part of the same development loop.

Performance is the one area I've deliberately left as a known limitation. Running a DOS emulator, a browser file system, animated cursors, screensavers, and multiple applications simultaneously has a ceiling, and on lower-end hardware it shows. It's a recreation, not an optimized runtime — the fidelity tradeoff is intentional.

---

## Where It Stands

[Windows 98 Web Edition](https://azayrahmad.github.io/win98-web/) is a Progressive Web App installable on desktop, MIT licensed, with an [Application Development Guide](https://github.com/azayrahmad/win98-web/blob/main/src/apps/README.md) for adding your own applications and themes. It even includes a Disk Defragmenter simulator for those who miss the hypnotic grid of shifting clusters.

What started as blog decoration ended up somewhere I didn't anticipate. The desktop themes memory from childhood turned into the one feature that distinguishes this project from everything else in the space. That's a satisfying way for a side project to turn out.

---

*Source: [github.com/azayrahmad/win98-web](https://github.com/azayrahmad/win98-web) — Live demo: [azayrahmad.github.io/win98-web](https://azayrahmad.github.io/win98-web/)*
