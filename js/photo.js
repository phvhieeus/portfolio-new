// ==================== VARIABLES ====================
let photoData = [];
let currentPhotoIndex = 0;

// ==================== INITIALIZATION ====================
function initializePhotos() {
  const photoGallery = document.getElementById("photoGallery");
  if (!photoGallery) return;

  // Show loading
  showLoading("photoGallery");

  try {
    // Load photo data
    photoData = window.photoDataSource || [];

    // Render photos
    renderPhotos(photoData);

    // Setup modal
    setupPhotoModal();
  } catch (error) {
    console.error("Error loading photos:", error);
    showError("photoGallery", "Error loading photo gallery.");
  }
}

// ==================== RENDERING ====================
function renderPhotos(photos) {
  const photoGallery = document.getElementById("photoGallery");
  if (!photoGallery) return;

  photoGallery.innerHTML = "";

  if (!photos || photos.length === 0) {
    photoGallery.innerHTML = '<div class="loading">No photos found.</div>';
    return;
  }

  photos.forEach((photo, index) => {
    const photoItem = createPhotoItem(photo, index);
    photoGallery.appendChild(photoItem);
  });
}

function createPhotoItem(photo, index) {
  const item = document.createElement("div");
  item.className = "photo-item";

  item.innerHTML = `
    <img src="${photo.image}" alt="${photo.title}" class="photo-image"
         onerror="this.style.background='#f5f5f7'; this.style.display='block';">
    
    <div class="photo-overlay">
      <div class="photo-overlay-content">
        <div class="photo-title">${photo.title}</div>
        <div class="photo-description">${photo.description}</div>
      </div>
    </div>
  `;

  // Add click handler to open modal
  item.addEventListener("click", () => openPhotoModal(index));

  return item;
}

// ==================== PHOTO MODAL ====================
function setupPhotoModal() {
  const modal = document.getElementById("photoModal");
  const closeBtn = document.querySelector(".close-modal");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!modal || !closeBtn || !prevBtn || !nextBtn) return;

  // Close modal handlers
  closeBtn.addEventListener("click", closePhotoModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closePhotoModal();
  });

  // Navigation handlers
  prevBtn.addEventListener("click", showPrevPhoto);
  nextBtn.addEventListener("click", showNextPhoto);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("active")) {
      switch (e.key) {
        case "Escape":
          closePhotoModal();
          break;
        case "ArrowLeft":
          showPrevPhoto();
          break;
        case "ArrowRight":
          showNextPhoto();
          break;
      }
    }
  });
}

function openPhotoModal(index) {
  const modal = document.getElementById("photoModal");
  const modalImage = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!modal || !modalImage || !modalCaption) return;

  currentPhotoIndex = index;
  const photo = photoData[index];

  modalImage.src = photo.image;
  modalCaption.textContent = `${photo.title} - ${photo.description}`;

  // Update navigation buttons
  if (prevBtn) prevBtn.disabled = index === 0;
  if (nextBtn) nextBtn.disabled = index === photoData.length - 1;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePhotoModal() {
  const modal = document.getElementById("photoModal");
  if (!modal) return;

  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function showPrevPhoto() {
  if (currentPhotoIndex > 0) {
    openPhotoModal(currentPhotoIndex - 1);
  }
}

function showNextPhoto() {
  if (currentPhotoIndex < photoData.length - 1) {
    openPhotoModal(currentPhotoIndex + 1);
  }
}

// Empty functions to prevent errors (search/sort disabled)
function searchPhotos(searchTerm) {
  // Do nothing - search disabled
}

function sortPhotos(sortType) {
  // Do nothing - sort disabled
}
