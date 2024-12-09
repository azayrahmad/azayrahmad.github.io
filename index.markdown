---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

<style type="text/css" media="screen">
  .container {
    margin: 10px auto;
    text-align: right;
  }
  .homepage-title {
    /* margin: 30px 0; */
    font-size: 7em;
    line-height: 1;
    letter-spacing: -3px;
    font-weight: bold;
    /*opacity: 0; /* Initially hidden */
  }
  .homepage-subtitle {
    margin: 30px 0;
    font-size: 2em;
    line-height: 1.5;
    letter-spacing: -2px;
    text-transform: uppercase
    /*animation: fadeInSlideRight 1s ease-in-out forwards; /* Fade in and slide from right */
  }

  .blur-in {
    animation: blurIn 1s ease-in-out;
  }

  .fade-in-slow {
    opacity: 0;
    animation: fadeInSlideRight 1s ease-in-out forwards;
  }

  @keyframes fadeInSlideRight {
            0% {
                transform: translateY(-20%);
                opacity: 0;
            }
            100% {
                transform: translateY(0);
                opacity: 1;
            }
        }
  @keyframes blurIn {
            0% {
                filter: blur(4px);
            }
            100% {
                filter: blur(0);
            }
        }
</style>

<div class="container">
  <h1 class="homepage-title"><a href="/about">aziz</a> rahmad.</h1>
  <p class="homepage-subtitle"><a href="/projects">Software engineer</a> specializing in .NET since 2015. <a href="/lecturing">University lecturer</a> covering wide range of computer science topics.</p>
  <p class="homepage-subtitle">Get in <a href="mailto:azayrahmad@gmail.com">touch</a>, check my <a href="https://www.linkedin.com/in/aziz-rahmad">LinkedIn profile</a>, view my <a href="/resume">resume</a>, or read my posts below.</p>
</div>
