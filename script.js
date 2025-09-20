// Sample project data - CÓ STARS VÀ GIT LINKS
const projectsData = [
  {
    id: 1,
    title: "Personal SaaS",
    date: "May 24, 2024",
    description: "E-commerce and sales management platform for SMBs",
    image: "images/project1.jpg",
    gitLink: "https://github.com/yourusername/personal-saas",
    stars: 125,
    tags: [
      "NextJS",
      "TailwindCSS",
      "Docker",
      "TypeScript",
      "MongoDB",
      "SaaS",
      "AWS",
    ],
    category: "web",
  },
  {
    id: 2,
    title: "SaaS Theme",
    date: "December 31, 2023",
    description:
      "A highly customizable SaaS theme allowing users to personalize every aspect of their website",
    image: "images/project2.jpg",
    gitLink: "https://github.com/yourusername/saas-theme",
    stars: 89,
    tags: ["NextJS", "Redux", "AWS", "GraphQL", "SaaS", "E-commerce"],
    category: "web",
  },
  {
    id: 3,
    title: "Instagram Clone",
    date: "November 30, 2023",
    description: "Appointment management system for US nail salons",
    image: "images/project3.jpg",
    gitLink: "https://github.com/yourusername/instagram-clone",
    stars: 67,
    tags: ["React Native", "Node.js", "Socket.io", "MongoDB"],
    category: "mobile",
  },
];

// DOM elements
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const projectsGrid = document.getElementById("projectsGrid");

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  renderProjects(projectsData);
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Tab switching
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.getAttribute("data-tab");
      switchTab(tabName, button);
    });
  });

  // Search functionality
  searchInput.addEventListener("input", handleSearch);

  // Sort functionality
  sortSelect.addEventListener("change", handleSort);
}

function switchTab(tabName, button) {
  // Remove active class from all tabs and buttons
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  tabContents.forEach((content) => content.classList.remove("active"));

  // Add active class to clicked button and corresponding content
  button.classList.add("active");
  document.getElementById(tabName).classList.add("active");

  // Show/Hide search bar - CHỈ HIỆN KHI Ở TAB PROJECTS
  const searchFilterBar = document.querySelector(".search-filter-bar");
  if (tabName === "projects") {
    searchFilterBar.classList.remove("hidden");
  } else {
    searchFilterBar.classList.add("hidden");
  }
}

// Render projects
function renderProjects(projects) {
  projectsGrid.innerHTML = "";

  projects.forEach((project) => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
  });
}

// Create individual project card - COMPACT LAYOUT
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
    
    <!-- BÊN PHẢI: Ảnh project nhỏ (có thể click) -->
    <div class="project-image-container" onclick="window.open('${
      project.gitLink
    }', '_blank')">
      <img src="${project.image}" alt="${project.title}" class="project-image" 
           onerror="this.style.background='#f5f5f7'; this.style.display='block';">
    </div>
  `;

  return card;
}

// Search functionality
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

// Sort functionality
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
    case "featured":
    default:
      // Keep original order for featured
      break;
  }

  renderProjects(sortedProjects);
}

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

// Add some interactive features
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

    setTimeout(typeWriter, 1000);
  }
}

// Call interactive features
addInteractiveFeatures();
