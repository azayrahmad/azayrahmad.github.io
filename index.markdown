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
  h1 {
    /* margin: 30px 0; */
    font-size: 7em;
    line-height: 1;
    letter-spacing: -3px;
    font-weight: bold;
    /*opacity: 0; /* Initially hidden */
  }
  .subtitle {
    margin: 30px 0;
    font-size: 2em;
    line-height: 1.5;
    letter-spacing: -2px;
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
  <h1 class="blur-in"><a href="/about">aziz</a> rahmad</h1>
  <p class="subtitle blur-in"><a href="/projects">SOFTWARE ENGINEER</a> SPECIALIZING IN .NET DEVELOPMENT SINCE 2015.</p>
  <p class="subtitle blur-in"><a href="/lecturing">UNIVERSITY LECTURER</a> COVERING WIDE RANGE OF COMPUTER SCIENCE TOPICS.</p>
  <p class="subtitle blur-in">GET IN <a href="mailto:azayrahmad@gmail.com">TOUCH</a>, CHECK MY <a href="linkedin.com/in/aziz-rahmad">LINKEDIN PROFILE</A>, VIEW MY <a href="/resume">RESUME</a>, OR READ MY POSTS BELOW.</p>
</div>
