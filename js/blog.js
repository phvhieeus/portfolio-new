// ==================== VARIABLES ====================
let blogData = [];

// ==================== INITIALIZATION ====================
function initializeBlogs() {
  const blogGrid = document.getElementById("blogGrid");
  if (!blogGrid) return;

  // Show loading
  showLoading("blogGrid");

  try {
    // Load blog data
    blogData = window.blogDataSource || [];

    // Render blogs
    renderBlogs(blogData);
  } catch (error) {
    console.error("Error loading blogs:", error);
    showError("blogGrid", "Error loading blog posts.");
  }
}

// ==================== RENDERING ====================
function renderBlogs(blogs) {
  const blogGrid = document.getElementById("blogGrid");
  if (!blogGrid) return;

  blogGrid.innerHTML = "";

  if (!blogs || blogs.length === 0) {
    blogGrid.innerHTML = '<div class="loading">No blog posts found.</div>';
    return;
  }

  blogs.forEach((blog, index) => {
    const blogCard = createBlogCard(blog, index === 0); // First post is featured
    blogGrid.appendChild(blogCard);
  });
}

function createBlogCard(blog, isFeatured = false) {
  const card = document.createElement("div");
  card.className = `blog-card ${isFeatured ? "featured" : ""}`;

  const readTime = calculateReadTime(blog.excerpt);

  card.innerHTML = `
    <div class="blog-image-container">
      <img src="${blog.image}" alt="${blog.title}" class="blog-image"
           onerror="this.style.background='#f5f5f7'; this.style.display='block';">
    </div>
    
    <div class="blog-content">
      <div class="blog-header">
        <h3 class="blog-title">${blog.title}</h3>
        
        <div class="blog-meta">
          <div class="blog-date">
            <i class="fas fa-calendar-alt"></i>
            ${formatDate(blog.date)}
          </div>
          <div class="blog-read-time">
            <i class="fas fa-clock"></i>
            ${readTime} min read
          </div>
        </div>
      </div>
      
      <p class="blog-excerpt">${blog.excerpt}</p>
      
      <div class="blog-footer">
        <div class="blog-stats">
          <div class="blog-views">
            <i class="fas fa-eye"></i>
            <span>${blog.views}</span>
          </div>
          <div class="blog-comments">
            <i class="fas fa-comment"></i>
            <span>${blog.comments}</span>
          </div>
        </div>
        
        <a href="${
          blog.link
        }" class="blog-read-more" target="_blank">Read More</a>
      </div>
    </div>
  `;

  // Add click handler
  card.addEventListener("click", (e) => {
    if (!e.target.classList.contains("blog-read-more")) {
      window.open(blog.link, "_blank");
    }
  });

  return card;
}

// Empty functions to prevent errors (search/sort disabled)
function searchBlogs(searchTerm) {
  // Do nothing - search disabled for blogs
}

function sortBlogs(sortType) {
  // Do nothing - sort disabled for blogs
}
