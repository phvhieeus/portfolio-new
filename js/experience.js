// ==================== VARIABLES ====================
let experienceData = [];

// ==================== INITIALIZATION ====================
function initializeExperience() {
  const experienceTimeline = document.getElementById("experienceTimeline");
  if (!experienceTimeline) return;

  // Show loading
  showLoading("experienceTimeline");

  try {
    // Load experience data
    experienceData = window.experienceDataSource || [];

    // Render experience
    renderExperience(experienceData);
  } catch (error) {
    console.error("Error loading experience:", error);
    showError("experienceTimeline", "Error loading experience data.");
  }
}

// ==================== RENDERING ====================
function renderExperience(experiences) {
  const experienceTimeline = document.getElementById("experienceTimeline");
  if (!experienceTimeline) return;

  experienceTimeline.innerHTML = "";

  if (!experiences || experiences.length === 0) {
    experienceTimeline.innerHTML =
      '<div class="loading">No experience data found.</div>';
    return;
  }

  experiences.forEach((experience) => {
    const experienceItem = createExperienceItem(experience);
    experienceTimeline.appendChild(experienceItem);
  });
}

function createExperienceItem(experience) {
  const item = document.createElement("div");
  item.className = "experience-item";

  const achievements = experience.achievements
    ? `<div class="experience-achievements">
       <ul>
         ${experience.achievements
           .map((achievement) => `<li>${achievement}</li>`)
           .join("")}
       </ul>
     </div>`
    : "";

  const techStack = experience.techStack
    ? `<div class="experience-tech">
       <strong>Tech:</strong> ${experience.techStack}
     </div>`
    : "";

  item.innerHTML = `
    <div class="experience-header">
      <div class="experience-left">
        <div class="experience-company">${experience.company}</div>
        <div class="experience-work-info">
          <span class="experience-work-tag">${experience.workType}</span>
          <span class="experience-work-tag">${experience.workMode}</span>
        </div>
      </div>
      <div class="experience-period">${experience.period}</div>
    </div>
    
    <div class="experience-position">${experience.position}</div>
    
    ${achievements}
    ${techStack}
  `;

  return item;
}

// ==================== SORT ONLY (NO SEARCH) ====================
function sortExperience(sortType) {
  let sortedExperience = [...experienceData];

  switch (sortType) {
    case "newest":
      sortedExperience.sort(
        (a, b) =>
          new Date(b.period.split(" - ")[0]) -
          new Date(a.period.split(" - ")[0])
      );
      break;
    case "oldest":
      sortedExperience.sort(
        (a, b) =>
          new Date(a.period.split(" - ")[0]) -
          new Date(b.period.split(" - ")[0])
      );
      break;
    case "company":
      sortedExperience.sort((a, b) => a.company.localeCompare(b.company));
      break;
    default:
      // Keep original order
      break;
  }

  renderExperience(sortedExperience);
}

// Empty search function to prevent errors
function searchExperience(searchTerm) {
  // Do nothing - search disabled for experience
}
