---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: windows
---

<style>
  #welcome-content-source {
    display: none;
    background: #e9e9e9;
    font-family: Tahoma, "MS Sans Serif", Arial, sans-serif;
    color: #222;
    padding: 24px 32px;
    box-shadow: 0 1px 0 #fff inset;
    min-width: 400px;
    max-width: 520px;
  }

  .welcome-wrapper {
      width: 100%;
      height: 100%;
      background: white;
  }

  .banner {
    font-size: 2em;
    font-weight: bold;
    color: #000080;
    margin-bottom: 18px;
    letter-spacing: 0.5px;
    padding-left: 10px;
  }

  .content-wrapper {
    display: flex;
    margin-top: 20px;
    height: calc(100% - 60px);
    width: 100%;
  }

  .options-panel {
    min-width: 170px;
    height: fit-content;
    flex: 2;
    margin-right: 10px;
  }

  .options-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .option {
    padding: 7px 16px;
    cursor: pointer;
    font-size: 1em;
    transition: background 0.15s, color 0.15s;
  }

  .option:hover,
  .option.active {
    background: #c0d3eb;
    color: #000080;
    font-weight: bold;
  }

  .detail-panel {
    flex: 3;
    min-width: 200px;
  }

  .detail-panel h2 {
    color: #000080;
    font-size: 1.25em;
    margin-top: 0;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .detail-panel p {
    margin: 0 0 8px 0;
    font-size: 1em;
  }

  .welcome-detail {
    display: none;
  }

  #welcome-intro {
    display: block;
  }
</style>

<div id="welcome-content-source">
  <div class="welcome-wrapper">
    <div class="banner">

  <button onclick="startClippy()">Show Clippy</button>
    </div>

    <div class="content-wrapper">
      <div class="options-panel">
      <div style="background-color: black; color: white; padding-left: 5px;">C O N T E N T S</div>
        <ul class="options-list">
          {% for option in site.data.welcome.options %}
          <li class="option" onmouseover="welcomeShowDetail('{{ option.id }}')">{{ option.title }}</li>
          {% endfor %}
        </ul>
      </div>

      <div class="detail-panel">
        <div id="welcome-intro" class="welcome-detail">
          <h2>{{ site.data.welcome.intro.title }}</h2>
          <p>{{ site.data.welcome.intro.content }}</p>
        </div>
        {% for option in site.data.welcome.options %}
        <div id="{{ option.id }}" class="welcome-detail">
          <h2>{{ option.title }}</h2> <!-- Added option title to detail panel -->
          <p>{{ option.content }}</p>
        </div>
        {% endfor %}
      </div>
    </div>
  </div>
</div>
