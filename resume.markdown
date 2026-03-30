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
          <a href="{{ job.url }}">{{ job.name }}</a> | {{ job.location }}
        </div>
        <p class="job-summary">{{ job.summary }}</p>
        <ul class="job-highlights">
          {% for highlight in job.highlights %}
            <li>{{ highlight }}</li>
          {% endfor %}
        </ul>
      </div>
    {% endfor %}
  </section>

  <section class="resume-section">
    <h2>Education</h2>
    {% for edu in resume.education %}
      <div class="education">
        <div class="edu-header">
          <span class="edu-degree">{{ edu.studyType | upcase }} OF {{ edu.area | upcase }}</span>
          <span class="edu-date">{{ edu.startDate | date: "%Y" }} - {{ edu.endDate | date: "%Y" }}</span>
        </div>
        <div class="edu-school">
          <a href="{{ edu.url }}">{{ edu.institution }}</a>
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
  .job, .education { margin-bottom: 1.5rem; }
  .job-header, .edu-header { display: flex; justify-content: space-between; font-weight: bold; }
  .job-company, .edu-school { font-style: italic; color: #555; margin-bottom: 0.5rem; }
  .job-highlights, .edu-courses { margin-top: 0.5rem; }
  .skill-category { margin-bottom: 0.5rem; }
  .resume-footer { margin-top: 3rem; text-align: center; border-top: 1px solid #eee; padding-top: 1rem; }
</style>
