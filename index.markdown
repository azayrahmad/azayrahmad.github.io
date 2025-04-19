---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: windows
---

<style>
  #welcome-content-source {
    display: none;
  }

  .content-wrapper {
    display: flex;
    margin-top: 20px;
  }

  .options-panel {
    flex: 1;
    padding: 20px;
  }

  .options-list {
    list-style-type: none;
    padding: 0;
  }

  .option {
    padding: 10px;
    margin: 5px 0;
    background-color: #f0f0f0;
    cursor: pointer;
    border-radius: 5px;
  }

  .detail-panel {
    flex: 1;
    padding: 20px;
    border-left: 1px solid #ddd;
  }

  .welcome-detail {
    display: none;
  }

  #welcome-intro {
    display: block;
  }
</style>

<div id="welcome-content-source">

    <div class="banner">
    aziz rahmad.
    </div>

    <div class="content-wrapper">
      <div class="options-panel">
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
          <p>{{ option.content }}</p>
        </div>
        {% endfor %}
      </div>
    </div>

</div>
