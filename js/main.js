// ==================== GLOBAL VARIABLES ====================
let currentTab = "projects";

// ==================== DOM ELEMENTS ====================
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", function () {
  console.log("Portfolio initializing...");

  // Setup event listeners
  setupEventListeners();

  // Add interactive features
  addInteractiveFeatures();

  // Initialize default tab
  switchTab(
    "projects",
    document.querySelector('.tab-btn[data-tab="projects"]')
  );

  console.log("Portfolio initialized successfully!");
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
    searchInput.addEventListener("input", handleGlobalSearch);
  }

  // Sort functionality
  if (sortSelect) {
    sortSelect.addEventListener("change", handleGlobalSort);
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

  // Update current tab
  currentTab = tabName;

  // Show/Hide search bar - CHỈ HIỆN CHO PROJECTS
  const searchFilterBar = document.querySelector(".search-filter-bar");
  if (searchFilterBar) {
    if (tabName === "projects") {
      // CHỈ HIỆN search bar cho projects
      searchFilterBar.style.display = "flex";
      searchFilterBar.classList.remove("hidden");

      // Update search placeholder
      if (searchInput) {
        searchInput.placeholder = "Search projects...";
        searchInput.value = ""; // Clear search
      }

      // Update sort options
      if (sortSelect) {
        updateSortOptions(tabName);
      }
    } else {
      // ẨN search bar cho tất cả tabs khác
      searchFilterBar.style.display = "none";
    }
  }

  // Load tab content if needed
  loadTabContent(tabName);
}

// ==================== SORT OPTIONS ====================
function updateSortOptions(tabName) {
  const sortOptions = {
    projects: [
      { value: "featured", text: "Featured" },
      { value: "newest", text: "Newest" },
      { value: "oldest", text: "Oldest" },
      { value: "stars", text: "Most Stars" },
    ],
  };

  if (sortSelect && sortOptions[tabName]) {
    sortSelect.innerHTML = "";
    sortOptions[tabName].forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      sortSelect.appendChild(optionElement);
    });
  }
}

// ==================== CONTENT LOADING ====================
function loadTabContent(tabName) {
  switch (tabName) {
    case "projects":
      if (typeof initializeProjects === "function") {
        initializeProjects();
      }
      break;
    case "experience":
      if (typeof initializeExperience === "function") {
        initializeExperience();
      }
      break;
    case "blogs":
      if (typeof initializeBlogs === "function") {
        initializeBlogs();
      }
      break;
    case "photo":
      if (typeof initializePhotos === "function") {
        initializePhotos();
      }
      break;
  }
}

// ==================== GLOBAL SEARCH ====================
function handleGlobalSearch(e) {
  const searchTerm = e.target.value.toLowerCase();

  // Chỉ search cho projects
  if (currentTab === "projects") {
    if (typeof searchProjects === "function") {
      searchProjects(searchTerm);
    }
  }
}

// ==================== GLOBAL SORT ====================
function handleGlobalSort(e) {
  const sortType = e.target.value;

  // Chỉ sort cho projects
  if (currentTab === "projects") {
    if (typeof sortProjects === "function") {
      sortProjects(sortType);
    }
  }
}

// ==================== INTERACTIVE FEATURES ====================
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
}

// ==================== UTILITY FUNCTIONS ====================
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '<div class="loading">Loading...</div>';
  }
}

function showError(containerId, message = "Error loading data") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `<div class="error">${message}</div>`;
  }
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function calculateReadTime(text) {
  const wordsPerMinute = 200;
  const words = text.split(" ").length;
  const readTime = Math.ceil(words / wordsPerMinute);
  return readTime;
}

// ==================== ERROR HANDLING ====================
window.addEventListener("error", function (e) {
  console.error("Portfolio error:", e.error);
});

window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled promise rejection:", e.reason);
});

// ==================== DARK MODE ====================
let isDarkMode = false;

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", function () {
  console.log("Portfolio initializing...");

  // Setup event listeners
  setupEventListeners();

  // Initialize dark mode
  initializeDarkMode();

  // Add interactive features
  addInteractiveFeatures();

  // Initialize default tab
  switchTab(
    "projects",
    document.querySelector('.tab-btn[data-tab="projects"]')
  );

  console.log("Portfolio initialized successfully!");
});

// ==================== DARK MODE INITIALIZATION ====================
function initializeDarkMode() {
  // Check for saved dark mode preference
  const savedDarkMode = localStorage.getItem("darkMode");

  if (savedDarkMode === "true") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }

  // Setup dark mode toggle
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", toggleDarkMode);
  }
}

function toggleDarkMode() {
  if (isDarkMode) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

function enableDarkMode() {
  document.body.classList.add("dark-mode");
  const darkModeIcon = document.getElementById("darkModeIcon");
  if (darkModeIcon) {
    darkModeIcon.className = "fas fa-sun";
  }
  isDarkMode = true;
  localStorage.setItem("darkMode", "true");
}

function disableDarkMode() {
  document.body.classList.remove("dark-mode");
  const darkModeIcon = document.getElementById("darkModeIcon");
  if (darkModeIcon) {
    darkModeIcon.className = "fas fa-moon";
  }
  isDarkMode = false;
  localStorage.setItem("darkMode", "false");
}

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
    searchInput.addEventListener("input", handleGlobalSearch);
  }

  // Sort functionality
  if (sortSelect) {
    sortSelect.addEventListener("change", handleGlobalSort);
  }
}

// ... rest of your existing main.js code remains the same
