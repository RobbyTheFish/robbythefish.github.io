document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initScrollAnimations();
  initNavbarScroll();
  initDownloadCV();
  fetchGitHubRepos();
});

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('active');
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('active');
    });
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.about-card, .about-text, .timeline-item, .skill-group, .repo-card:not(.skeleton), .contact-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 10, 15, 0.95)';
    } else {
      navbar.style.background = 'rgba(10, 10, 15, 0.85)';
    }
  });
}

function initDownloadCV() {
  const downloadBtn = document.getElementById('download-cv');
  const downloadBtnBottom = document.getElementById('download-cv-bottom');

  const handleDownload = (e) => {
    e.preventDefault();
    alert('CV will be available soon. Please check back later or contact me directly.');
  };

  if (downloadBtn) downloadBtn.addEventListener('click', handleDownload);
  if (downloadBtnBottom) downloadBtnBottom.addEventListener('click', handleDownload);
}

const LANG_COLORS = {
  'TypeScript': '#3178c6',
  'JavaScript': '#f7df1e',
  'Python': '#3776ab',
  'Go': '#00add8',
  'Rust': '#dea584',
  'Java': '#b07219',
  'Kotlin': '#a97bff',
  'C++': '#f34b7d',
  'C#': '#178600',
  'Shell': '#89e051',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Dockerfile': '#384d54',
  'Jupyter Notebook': '#da5b0b',
  'SCSS': '#c6538c',
  'Makefile': '#427819',
  'Vue': '#41b883',
  'PHP': '#4f5d95',
  'Ruby': '#701516',
};

const PINNED_REPOS = [
  'architech_digrub',
  'vibeton_kiskis',
  'brics-ctf-writeup',
  'tender-hack',
  'vault-moretech',
  'kis-kis-misis-shorthack-project',
];

async function fetchGitHubRepos() {
  const grid = document.getElementById('repos-grid');
  if (!grid) return;

  try {
    const res = await fetch('https://api.github.com/users/RobbyTheFish/repos?per_page=20&sort=pushed');
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const repos = await res.json();

    const pinned = PINNED_REPOS.map(name =>
      repos.find(r => r.name === name)
    ).filter(Boolean);

    const other = repos
      .filter(r => !PINNED_REPOS.includes(r.name))
      .filter(r => r.name !== 'robbythefish' && r.name !== 'robbythefish.github.io')
      .slice(0, 6 - pinned.length);

    const displayRepos = [...pinned, ...other].slice(0, 6);

    grid.innerHTML = '';

    displayRepos.forEach(repo => {
      const card = document.createElement('a');
      card.className = 'repo-card glass fade-in';
      card.href = repo.html_url;
      card.target = '_blank';
      card.rel = 'noopener';

      const desc = repo.description || 'No description';

      card.innerHTML = `
        <div class="repo-header">
          <i class="fa-solid fa-book-bookmark"></i>
          <span class="repo-name">${escapeHtml(repo.name)}</span>
        </div>
        <p class="repo-desc">${escapeHtml(desc)}</p>
        <div class="repo-meta">
          <div class="repo-language">
            <span class="lang-dot" style="background:${LANG_COLORS[repo.language] || '#888'}"></span>
            ${repo.language || 'N/A'}
          </div>
          <div class="repo-stars">
            <i class="fa-solid fa-star"></i> ${repo.stargazers_count}
          </div>
          <div class="repo-stars">
            <i class="fa-solid fa-code-fork"></i> ${repo.forks_count}
          </div>
        </div>
      `;

      grid.appendChild(card);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.15 });
      observer.observe(card);
    });

  } catch (err) {
    const grid = document.getElementById('repos-grid');
    if (grid) {
      grid.innerHTML = `<p class="repos-error">Failed to load repositories. <a href="https://github.com/RobbyTheFish" target="_blank" rel="noopener" style="color:var(--accent)">View on GitHub</a></p>`;
    }
    console.error('Failed to fetch repos:', err);
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}