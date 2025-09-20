// ==================== GITHUB API & CACHE ====================
const CACHE_KEY = "github_projects_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

// Function to fetch GitHub repo data
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

// Get cached data or fetch new
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

// Cache data
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

  const projectsData = [
    {
      id: 1,
      title: "BE_ggTranslate",
      date: beData.date,
      description:
        beData.description ||
        "Backend service for Google Translate integration with API endpoints",
      image: "images/project1.jpg",
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
      title: "spotify_clone",
      date: spotifyData.date,
      description:
        spotifyData.description ||
        "Full-stack Spotify clone with music streaming and playlist functionality",
      image: "images/project2.jpg",
      gitLink: "https://github.com/phvhieeus/spotify_clone",
      stars: spotifyData.stars,
      tags: ["JavaScript", "React", "Node.js", "Music", "Streaming", "Clone"],
      category: "web",
    },
    {
      id: 3,
      title: "Instagram Clone",
      date: "November 30, 2023",
      description:
        "Social media platform with photo sharing and user interactions",
      image: "images/project3.jpg",
      gitLink: "https://github.com/yourusername/instagram-clone",
      stars: 0,
      tags: ["React Native", "Node.js", "Socket.io", "MongoDB"],
      category: "mobile",
    },
  ];

  // Cache the result
  setCachedData(projectsData);
  return projectsData;
}

// Global projects data
let projectsData = [];

// ==================== DOM ELEMENTS ====================
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const projectsGrid = document.getElementById("projectsGrid");

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", async function () {
  // Show loading
  if (projectsGrid) {
    projectsGrid.innerHTML =
      '<div style="text-align: center; padding: 40px; color: #666; font-style: italic;">Loading projects...</div>';
  }

  try {
    // Load projects data
    projectsData = await getProjectsData();

    // Render projects
    renderProjects(projectsData);

    // Setup event listeners
    setupEventListeners();

    // Add interactive features
    addInteractiveFeatures();

    console.log("Portfolio initialized successfully!");
  } catch (error) {
    console.error("Error initializing portfolio:", error);
    if (projectsGrid) {
      projectsGrid.innerHTML =
        '<div style="text-align: center; padding: 40px; color: #e74c3c;">Error loading projects. Please refresh the page.</div>';
    }
  }
});

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Tab switching
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.getAttribute("data-tab");
      switchTab(tabName, button);
    });
  });

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }

  // Sort functionality
  if (sortSelect) {
    sortSelect.addEventListener("change", handleSort);
  }
}

// ==================== TAB SWITCHING ====================
function switchTab(tabName, button) {
  // Remove active class from all tabs and buttons
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  tabContents.forEach((content) => content.classList.remove("active"));

  // Add active class to clicked button and corresponding content
  button.classList.add("active");
  const targetTab = document.getElementById(tabName);
  if (targetTab) {
    targetTab.classList.add("active");
  }

  // Show/Hide search bar - CHỈ HIỆN KHI Ở TAB PROJECTS
  const searchFilterBar = document.querySelector(".search-filter-bar");
  if (searchFilterBar) {
    if (tabName === "projects") {
      searchFilterBar.classList.remove("hidden");
    } else {
      searchFilterBar.classList.add("hidden");
    }
  }
}

// ==================== PROJECT RENDERING ====================
function renderProjects(projects) {
  if (!projectsGrid) return;

  projectsGrid.innerHTML = "";

  if (!projects || projects.length === 0) {
    projectsGrid.innerHTML =
      '<div style="text-align: center; padding: 40px; color: #666;">No projects found.</div>';
    return;
  }

  projects.forEach((project) => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
  });
}

// Create individual project card
function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.innerHTML = `
    <!-- BÊN TRÁI: Thông tin project -->
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
    
    <!-- BÊN PHẢI: Ảnh project (có thể click) -->
    <div class="project-image-container" onclick="window.open('${
      project.gitLink
    }', '_blank')">
      <img src="${project.image}" alt="${project.title}" class="project-image" 
           onerror="this.style.background='#f5f5f7'; this.style.display='block';">
    </div>
  `;

  return card;
}

// ==================== SEARCH FUNCTIONALITY ====================
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredProjects = projectsData.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  );

  renderProjects(filteredProjects);
}

// ==================== SORT FUNCTIONALITY ====================
function handleSort(e) {
  const sortType = e.target.value;
  let sortedProjects = [...projectsData];

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

// ==================== INTERACTIVE FEATURES ====================
// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Add interactive features
function addInteractiveFeatures() {
  // Add typing animation to tagline
  const tagline = document.querySelector(".tagline");
  if (tagline) {
    const text = tagline.textContent;
    tagline.textContent = "";
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        tagline.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }

    // Start typing animation after 1 second
    setTimeout(typeWriter, 1000);
  }
}

// ==================== UTILITY FUNCTIONS ====================
// Force refresh cache (for development)
function refreshCache() {
  localStorage.removeItem(CACHE_KEY);
  location.reload();
}

// Log cache info (for debugging)
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

// ==================== ERROR HANDLING ====================
window.addEventListener("error", function (e) {
  console.error("Portfolio error:", e.error);
});

window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled promise rejection:", e.reason);
});
