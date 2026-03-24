---
layout: post
title: "Recreating Windows 98 Desktop Themes on the web"
---


---

## It was 2002...

I had just gotten back home for my school break when I noticed a computer in my room. A beige, yellowing Pentium MMX running Windows 98 that my father had bought secondhand for me. I had experience using computers before, but this was my family’s first personal computer, even if it's already outdated at the time. The moment I turned on the machine and saw the bulky CRT glowed, I became completely obsessed.

There are many aspects of a computer that I'm fascinated about, but for the purpose of this article I'd like to focus on one: desktop themes. It's probably weird, but the audiovisual experience of using a computer is what makes it more than just a tool, and the ability to personalize it is one that truly makes it mine. I spent countless hours customizing the look and the sound of my computer, randomly playing a screensaver and staring at it endlessly, and collecting desktop theme files from any other computer I can get my hands on to my array of diskettes.

[screenshot of windows 98 vm with active desktop theme]

---

## Phase 1: Dressing Up the Blog (March 2025)

Fast forward 23 years later. I had been a software engineer for a decade at that point. They say these days every software engineer should own a website, so I finally caved in and made my first personal website. [azayrahmad.github.io](https://azayrahmad.github.io), a Jekyll blog with my CV and some articles I made. I randomly remembered my experience with Windows 98 desktop themes and thought about expressing a little bit about myself more through the website design. I was thinking of making my website look like Windows 98.

Web development, especially JavaScript, was not my strength. So to achieve this I leaned on LLM tools to help with CSS and JS work. However, merely instructing Claude or ChatGPT to create a Windows 98 themed webpage was and still is not enough, at least visually. It could create a working Windows Explorer and Notepad and even Minesweeper inside a webpage, but somehow visually it's just slop.

[screenshot of various sloppy AI generated idea of what Windows 98 looks like]

Enter **[98.css](https://jdan.github.io/98.css/)**, a CSS library that recreates the Windows 98 visual language I found online. This is one of the first times I found a serious attempt at recreating Windows 98 look accurately down to pixel sizes. By mentioning this docs page to AI, it successfully overrode my default Jekyll Minima theme with Windows 98 theme easily.

I tried making it interactive with working windows and taskbar using AI-generated JavaScript, but complexity grew and I decided to stop overriding Jekyll theme and start building a proper website from scratch by mid-2025.

---

## Phase 2: A Proper Separate Project (August 2025)

I opened a new repository — [win98-web](https://github.com/azayrahmad/win98-web) — as a standalone project built started with a single HTML page, a modified 98.css file, and a bunch of JavaScript files refactored from the previous project. I must not be the first one to have this idea so I explored similar attempts on creating Windows 98-like website before continuing.

There are some great Windows 9x-like websites: [windows93.net](https://www.windows93.net/), [Windows 96](https://windows96.net/), [98.js.org](https://98.js.org/) are the most notable. Each takes a different approach: Windows 96 is a more like a Web OS with Win9x skins, windows93 is more of an art/parody project, and 98.js.org is the closest to the real Windows 98. I decided to explore the 98.js.org repository more especially on its theming implementation.

It uses **[os-gui.js](https://os-gui.js.org/)**, a great JavaScript library that implements many of the windows functionalities and also support color schemes adapted from [tpenguinltg's WinClassic project](https://tpenguinltg.github.io/winclassic/). I thought that I shouldn't reinvent the wheel and just integrate it to my website. 98.css and os-gui have their own idea on implementing the visual so I had to manually integrate them to work together.

Unfortunately, none of them had a complete Desktop Themes implementation. 98.js.org already supports extracting color scheme from `.theme` file, but that's it. What nobody had done was the full bundle: wallpapers, animated `.ani` cursor sets, and sound event mappings all applying together from a single `.theme` file, the way Windows 98 actually shipped them. That was the gap that I cared about personally. So that's where I started.

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
