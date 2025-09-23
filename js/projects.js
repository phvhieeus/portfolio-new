// ==================== GITHUB API & CACHE ====================
const CACHE_KEY = "github_projects_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

let projectsData = [];
let filteredProjects = [];

// ==================== GITHUB API ====================
async function fetchGitHubData(owner, repoName) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return {
      stars: data.stargazers_count,
      date: new Date(data.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      language: data.language,
      description: data.description || "",
    };
  } catch (error) {
    console.error(`Error fetching ${repoName}:`, error);
    return {
      stars: 0,
      date: "Unknown",
      language: "Unknown",
      description: "Error loading data",
    };
  }
}

// ==================== CACHE FUNCTIONS ====================
function getCachedData() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  return null;
}

function setCachedData(data) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
}

// ==================== PROJECT DATA ====================
async function getProjectsData() {
  // Check cache first
  const cachedData = getCachedData();
  if (cachedData) {
    console.log("Loading projects from cache...");
    return cachedData;
  }

  console.log("Fetching fresh project data from GitHub...");

  // Fetch data from GitHub API
  const beData = await fetchGitHubData("phvhieeus", "BE_ggTranslate");
  const spotifyData = await fetchGitHubData("phvhieeus", "spotify_clone");

  const projects = [
    {
      id: 1,
      title: "BE_ggTranslate",
      date: beData.date,
      description:
        beData.description ||
        "Backend service for Google Translate integration with API endpoints",
      image: "images/projects/project1.jpg",
      gitLink: "https://github.com/phvhieeus/BE_ggTranslate",
      stars: beData.stars,
      tags: [
        "Java",
        "Spring Boot",
        "REST API",
        "Translation",
        "Backend",
        "Google API",
      ],
      category: "backend",
    },
    {
      id: 2,
      title: "Portfolio Website",
      date: "December 15, 2024",
      description:
        "Personal portfolio website built with vanilla HTML, CSS, and JavaScript",
      image: "images/projects/project3.jpg",
      gitLink: "https://github.com/phvhieeus/portfolio",
      stars: 5,
      tags: ["HTML", "CSS", "JavaScript", "Portfolio", "Responsive"],
      category: "web",
    },
    {
      id: 3,
      title: "XisuFashion",
      date: "November 20, 2024",
      description:
        "Full-stack e-commerce platform with payment integration and admin dashboard",
      image: "images/projects/project4.jpg",
      gitLink: "https://github.com/phvhieeus/XisuFashion",
      stars: 12,
      tags: ["Java", "Spring Boot", "MySQL", "E-commerce"],
      category: "web",
    },
  ];

  // Cache the result
  setCachedData(projects);
  return projects;
}

// ==================== INITIALIZATION ====================
async function initializeProjects() {
  const projectsGrid = document.getElementById("projectsGrid");
  if (!projectsGrid) return;

  // Show loading
  showLoading("projectsGrid");

  try {
    // Load projects data
    projectsData = await getProjectsData();
    filteredProjects = [...projectsData];

    // Render projects
    renderProjects(filteredProjects);
  } catch (error) {
    console.error("Error loading projects:", error);
    showError(
      "projectsGrid",
      "Error loading projects. Please refresh the page."
    );
  }
}

// ==================== RENDERING ====================
function renderProjects(projects) {
  const projectsGrid = document.getElementById("projectsGrid");
  if (!projectsGrid) return;

  projectsGrid.innerHTML = "";

  if (!projects || projects.length === 0) {
    projectsGrid.innerHTML = '<div class="loading">No projects found.</div>';
    return;
  }

  projects.forEach((project) => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
  });
}

function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.innerHTML = `
    <div class="project-info">
      <div class="project-header">
        <h3 class="project-title">${project.title}</h3>
        <div class="project-date">${project.date}</div>
      </div>
      
      <p class="project-description">${project.description}</p>
      
      <div class="project-footer">
        <div class="project-tags">
          ${project.tags
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}
        </div>
        
        <div class="project-stars">
          <i class="fas fa-star"></i>
          <span>${project.stars}</span>
        </div>
      </div>
    </div>
    
    <div class="project-image-container" onclick="window.open('${
      project.gitLink
    }', '_blank')">
      <img src="${project.image}" alt="${project.title}" class="project-image" 
           onerror="this.style.background='#f5f5f7'; this.style.display='block';">
    </div>
  `;

  return card;
}

// ==================== SEARCH & SORT ====================
function searchProjects(searchTerm) {
  if (!searchTerm) {
    filteredProjects = [...projectsData];
  } else {
    filteredProjects = projectsData.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }
  renderProjects(filteredProjects);
}

function sortProjects(sortType) {
  let sortedProjects = [...filteredProjects];

  switch (sortType) {
    case "newest":
      sortedProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "oldest":
      sortedProjects.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case "stars":
      sortedProjects.sort((a, b) => b.stars - a.stars);
      break;
    case "featured":
    default:
      // Keep original order for featured
      break;
  }

  renderProjects(sortedProjects);
}

// ==================== UTILITY FUNCTIONS ====================
function refreshCache() {
  localStorage.removeItem(CACHE_KEY);
  location.reload();
}

function logCacheInfo() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { timestamp } = JSON.parse(cached);
    const age = (Date.now() - timestamp) / 1000 / 60; // minutes
    console.log(`Cache age: ${age.toFixed(1)} minutes`);
  } else {
    console.log("No cache found");
  }
}

// Expose utility functions to global scope for debugging
window.refreshCache = refreshCache;
window.logCacheInfo = logCacheInfo;
