---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---

<style type="text/css" media="screen">
  .container {
    margin: 40px auto;
    max-width: 1200px;
    padding: 0 20px;
    text-align: center;
  }

  .profile-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    margin-bottom: 40px;
  }

  .profile-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }

  .profile-image:hover {
    transform: scale(1.05);
  }

  .text-content {
    text-align: left;
    max-width: 600px;
  }

  .homepage-title {
    font-size: 4.5em;
    line-height: 1.2;
    letter-spacing: -2px;
    font-weight: bold;
    margin: 0;
    background: linear-gradient(45deg, #2196F3, #00BCD4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 8s ease infinite;
  }

  .homepage-subtitle {
    font-size: 1.5em;
    line-height: 1.6;
    margin: 20px 0;
    color: #555;
  }

  .skills-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin: 40px 0;
  }

  .skill-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  .skill-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .skill-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
  }

  .contact-links {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 30px 0;
  }

  .contact-link {
    padding: 10px 20px;
    border-radius: 25px;
    background: #f8f9fa;
    color: #333;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .contact-link:hover {
    background: #2196F3;
    color: white;
  }

  .blur-in {
    animation: blurIn 1s ease-in-out;
  }

  .fade-in {
    opacity: 0;
    animation: fadeInUp 1s ease-in-out forwards;
  }

  @keyframes fadeInUp {
    0% {
      transform: translateY(20px);
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

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @media (max-width: 768px) {
    .profile-section {
      flex-direction: column;
      text-align: center;
    }

    .text-content {
      text-align: center;
    }

    .homepage-title {
      font-size: 3em;
    }

    .homepage-subtitle {
      font-size: 1.2em;
    }
  }
</style>

<div class="container">
  <div class="profile-section fade-in">
    <img src="/assets/images/profile.jpg" alt="Aziz Rahmad" class="profile-image blur-in">
    <div class="text-content">
      <h1 class="homepage-title"><a href="/about">aziz</a> rahmad.</h1>
      <p class="homepage-subtitle">A <a href="/projects">Software engineer</a> specializing in .NET since 2015 and a <a href="/lecturing">University lecturer</a> passionate about computer science education.</p>
    </div>
  </div>

  <div class="skills-section fade-in">
    <div class="skill-card">
      <img src="/assets/images/dotnet.svg" alt=".NET" class="skill-icon">
      <h3>.NET Development</h3>
    </div>
    <div class="skill-card">
      <img src="/assets/images/teaching.svg" alt="Teaching" class="skill-icon">
      <h3>Computer Science Education</h3>
    </div>
    <div class="skill-card">
      <img src="/assets/images/code.svg" alt="Code" class="skill-icon">
      <h3>Software Architecture</h3>
    </div>
  </div>

  <div class="contact-links fade-in">
    <a href="mailto:azayrahmad@gmail.com" class="contact-link">Email</a>
    <a href="https://www.linkedin.com/in/aziz-rahmad" class="contact-link">LinkedIn</a>
    <a href="/resume" class="contact-link">Resume</a>
  </div>
</div>