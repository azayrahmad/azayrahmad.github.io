---
layout: page
title: Resume
permalink: /resume/
---

{% assign resume = site.data.resume %}

<div class="resume">
  <header class="resume-header">
    <h1>{{ resume.basics.name }}</h1>
    <p class="label">{{ resume.basics.label }}</p>
    <p class="contact">
      {{ resume.basics.email }} | {{ resume.basics.phone }} |
      <a href="{{ resume.basics.url }}">{{ resume.basics.url | replace: "https://", "" }}</a>
    </p>
    <p class="location">
      {{ resume.basics.location.city }}, {{ resume.basics.location.region }}, {{ resume.basics.location.countryCode }}
    </p>
    <div class="profiles">
      {% for profile in resume.basics.profiles %}
        <a href="{{ profile.url }}">{{ profile.network }}</a>{% unless forloop.last %} | {% endunless %}
      {% endfor %}
    </div>
  </header>

  <section class="resume-section">
    <h2>Professional Summary</h2>
    <p>{{ resume.basics.summary }}</p>
  </section>

  <section class="resume-section">
    <h2>Professional Experience</h2>
    {% for job in resume.work %}
      <div class="job">
        <div class="job-header">
          <span class="job-title">{{ job.position | upcase }}</span>
          <span class="job-date">{{ job.startDate | date: "%B %Y" }} - {% if job.endDate %}{{ job.endDate | date: "%B %Y" }}{% else %}Present{% endif %}</span>
        </div>
        <div class="job-company">
          {% if job.url %}<a href="{{ job.url }}">{% endif %}{{ job.name }}{% if job.url %}</a>{% endif %} | {{ job.location }}
        </div>
        {% if job.description %}<p class="job-company-desc"><em>{{ job.description }}</em></p>{% endif %}
        <p class="job-summary">{{ job.summary }}</p>
        <ul class="job-highlights">
          {% for highlight in job.highlights %}
            <li>{{ highlight }}</li>
          {% endfor %}
        </ul>
      </div>
    {% endfor %}
  </section>

  {% if resume.projects %}
  <section class="resume-section">
    <h2>Key Projects</h2>
    {% for project in resume.projects %}
      <div class="project">
        <div class="project-header">
          <span class="project-name">{{ project.name | upcase }}</span>
          <span class="project-date">
            {{ project.startDate | date: "%b %Y" }}
            {% if project.endDate %} - {{ project.endDate | date: "%b %Y" }}{% else %} - Present{% endif %}
          </span>
        </div>
        <div class="project-entity">
          {% if project.entity %}<em>{{ project.entity }}</em>{% endif %}
          {% if project.roles %} | {{ project.roles | join: ", " }}{% endif %}
          {% if project.type %} | <strong>{{ project.type }}</strong>{% endif %}
        </div>
        <p class="project-description">{{ project.description }}</p>
        <ul class="project-highlights">
          {% for highlight in project.highlights %}
            <li>{{ highlight }}</li>
          {% endfor %}
        </ul>
        {% if project.keywords %}
          <p class="project-keywords"><strong>Technologies:</strong> {{ project.keywords | join: ", " }}</p>
        {% endif %}
      </div>
    {% endfor %}
  </section>
  {% endif %}

  <section class="resume-section">
    <h2>Education</h2>
    {% for edu in resume.education %}
      <div class="education">
        <div class="edu-header">
          <span class="edu-degree">{{ edu.studyType | upcase }} OF {{ edu.area | upcase }}</span>
          <span class="edu-date">{{ edu.startDate | date: "%Y" }} - {{ edu.endDate | date: "%Y" }}</span>
        </div>
        <div class="edu-school">
          {% if edu.url %}<a href="{{ edu.url }}">{% endif %}{{ edu.institution }}{% if edu.url %}</a>{% endif %}
        </div>
        {% if edu.score %}
          <p class="edu-score">GPA: {{ edu.score }}/4.00</p>
        {% endif %}
        <ul class="edu-courses">
          {% for course in edu.courses %}
            <li>{{ course }}</li>
          {% endfor %}
        </ul>
      </div>
    {% endfor %}
  </section>

  {% if resume.awards %}
  <section class="resume-section">
    <h2>Awards & Honors</h2>
    <ul class="awards">
      {% for award in resume.awards %}
        <li>
          <strong>{{ award.title }}</strong> - {{ award.awarder }} ({{ award.date | date: "%Y" }})
          <p>{{ award.summary }}</p>
        </li>
      {% endfor %}
    </ul>
  </section>
  {% endif %}

  {% if resume.publications %}
  <section class="resume-section">
    <h2>Publications</h2>
    {% for pub in resume.publications %}
      <div class="publication">
        <div class="pub-header">
          <span class="pub-name"><strong>{% if pub.url %}<a href="{{ pub.url }}">{% endif %}{{ pub.name | upcase }}{% if pub.url %}</a>{% endif %}</strong></span>
          <span class="pub-date">{{ pub.releaseDate | date: "%Y" }}</span>
        </div>
        <div class="pub-publisher"><em>{{ pub.publisher }}</em></div>
        <p class="pub-summary">{{ pub.summary }}</p>
      </div>
    {% endfor %}
  </section>
  {% endif %}

  {% if resume.volunteer %}
  <section class="resume-section">
    <h2>Volunteer Work</h2>
    {% for vol in resume.volunteer %}
      <div class="volunteer">
        <div class="vol-header">
          <span class="vol-org"><strong>{% if vol.url %}<a href="{{ vol.url }}">{% endif %}{{ vol.organization | upcase }}{% if vol.url %}</a>{% endif %}</strong></span>
          <span class="vol-date">{{ vol.startDate | date: "%Y" }} - {% if vol.endDate %}{{ vol.endDate | date: "%Y" }}{% else %}Present{% endif %}</span>
        </div>
        <div class="vol-position"><em>{{ vol.position }}</em></div>
        <p class="vol-summary">{{ vol.summary }}</p>
        {% if vol.highlights %}
          <ul class="vol-highlights">
            {% for highlight in vol.highlights %}
              <li>{{ highlight }}</li>
            {% endfor %}
          </ul>
        {% endif %}
      </div>
    {% endfor %}
  </section>
  {% endif %}

  <section class="resume-section">
    <h2>Technical Skills</h2>
    <div class="skills-grid">
      {% for skill in resume.skills %}
        <div class="skill-category">
          <strong>{{ skill.name }}:</strong> {{ skill.keywords | join: ", " }}
        </div>
      {% endfor %}
    </div>
  </section>

  {% if resume.languages %}
  <section class="resume-section">
    <h2>Languages</h2>
    <ul class="languages">
      {% for lang in resume.languages %}
        <li><strong>{{ lang.language }}:</strong> {{ lang.fluency }}</li>
      {% endfor %}
    </ul>
  </section>
  {% endif %}

  {% if resume.interests %}
  <section class="resume-section">
    <h2>Interests</h2>
    <ul class="interests">
      {% for interest in resume.interests %}
        <li><strong>{{ interest.name }}:</strong> {{ interest.keywords | join: ", " }}</li>
      {% endfor %}
    </ul>
  </section>
  {% endif %}

  <section class="resume-section">
    <h2>Certifications</h2>
    <ul class="certifications">
      {% for cert in resume.certificates %}
        <li>{{ cert.name }} - {{ cert.issuer }} ({{ cert.date | date: "%b %Y" }})</li>
      {% endfor %}
    </ul>
  </section>

  <footer class="resume-footer">
    <p><a href="/resume.json" download="Aziz_Rahmad_Resume.json">Download JSON Resume</a></p>
  </footer>
</div>

<style>
  .resume-header { text-align: center; margin-bottom: 2rem; }
  .resume-header h1 { margin-bottom: 0; }
  .resume-header .label { font-size: 1.2rem; font-weight: bold; color: #666; }
  .resume-section { margin-bottom: 2rem; }
  .resume-section h2 { border-bottom: 1px solid #eee; padding-bottom: 0.5rem; margin-bottom: 1rem; text-transform: uppercase; font-size: 1.2rem; }
  .job, .education, .project { margin-bottom: 1.5rem; }
  .job-header, .edu-header, .project-header, .pub-header, .vol-header { display: flex; justify-content: space-between; font-weight: bold; }
  .job-company, .edu-school, .project-entity, .pub-publisher, .vol-position { font-style: italic; color: #555; margin-bottom: 0.5rem; }
  .job-company-desc { font-size: 0.95rem; color: #666; margin-bottom: 0.5rem; }
  .job-highlights, .edu-courses, .project-highlights, .vol-highlights { margin-top: 0.5rem; }
  .project-keywords { font-size: 0.9rem; color: #444; }
  .skill-category { margin-bottom: 0.5rem; }
  .resume-footer { margin-top: 3rem; text-align: center; border-top: 1px solid #eee; padding-top: 1rem; }
</style>
