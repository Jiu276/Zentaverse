// Blog Post Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Get article ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id') || 1;
    
    // Load article data
    loadArticle(articleId);
    
    // Initialize event listeners
    initializeEventListeners();
});

function loadArticle(articleId) {
    const article = getBlogArticleById(articleId);
    
    if (!article) {
        // Redirect to home if article not found
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title
    document.title = `${article.title} - Zentaverse`;
    document.getElementById('pageTitle').textContent = `${article.title} - Zentaverse`;
    
    // Update breadcrumb
    document.getElementById('breadcrumbCategory').textContent = capitalizeFirst(article.category);
    document.getElementById('breadcrumbTitle').textContent = article.title;
    
    // Update post header
    document.getElementById('postCategory').textContent = capitalizeFirst(article.category);
    document.getElementById('postTitle').textContent = article.title;
    document.getElementById('authorName').textContent = article.author;
    document.getElementById('postDate').textContent = formatDate(article.date);
    document.getElementById('readTime').textContent = article.readTime;
    document.getElementById('likeCount').textContent = article.likes || 0;
    
    // Update featured image
    const featuredImage = document.getElementById('featuredImage');
    featuredImage.src = article.featuredImage || article.image;
    featuredImage.alt = article.title;
    
    // Update post content
    document.getElementById('postContent').innerHTML = article.content;
    
    // Update tags
    const tagsContainer = document.getElementById('postTags');
    if (article.tags && article.tags.length > 0) {
        tagsContainer.innerHTML = article.tags.map(tag => 
            `<a href="#" class="tag">#${tag}</a>`
        ).join('');
    }
    
    // Update author bio
    document.getElementById('bioAuthorName').textContent = article.author;
    if (article.authorBio) {
        document.getElementById('bioDescription').textContent = article.authorBio;
    }
    
    // Load related articles
    loadRelatedArticles(articleId, article.category);
    
    // Load popular articles
    loadPopularArticles();
    
    // Update navigation
    updatePostNavigation(articleId);
}

function loadRelatedArticles(currentId, category) {
    const relatedPosts = document.getElementById('relatedPosts');
    const related = getRelatedArticles(currentId, category, 3);
    
    if (related.length > 0) {
        relatedPosts.innerHTML = related.map(article => `
            <a href="blog-post.html?id=${article.id}" class="related-post">
                <img src="${article.image}" alt="${article.title}" class="post-thumb">
                <div class="post-info">
                    <h4>${article.title}</h4>
                    <span>${formatDate(article.date)}</span>
                </div>
            </a>
        `).join('');
    } else {
        // If no related articles in same category, show random articles
        const randomArticles = extendedBlogArticles
            .filter(a => a.id !== parseInt(currentId))
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
            
        relatedPosts.innerHTML = randomArticles.map(article => `
            <a href="blog-post.html?id=${article.id}" class="related-post">
                <img src="${article.image}" alt="${article.title}" class="post-thumb">
                <div class="post-info">
                    <h4>${article.title}</h4>
                    <span>${formatDate(article.date)}</span>
                </div>
            </a>
        `).join('');
    }
}

function loadPopularArticles() {
    const popularPosts = document.getElementById('popularPosts');
    const popular = getPopularArticles(5);
    
    popularPosts.innerHTML = popular.map(article => `
        <a href="blog-post.html?id=${article.id}" class="popular-post">
            <img src="${article.image}" alt="${article.title}" class="post-thumb">
            <div class="post-info">
                <h4>${article.title}</h4>
                <span>${article.views || 0} views</span>
            </div>
        </a>
    `).join('');
}

function updatePostNavigation(currentId) {
    const current = parseInt(currentId);
    const prevPost = document.getElementById('prevPost');
    const nextPost = document.getElementById('nextPost');
    
    // Find previous article
    const prevArticle = extendedBlogArticles.find(a => a.id === current - 1);
    if (prevArticle) {
        prevPost.href = `blog-post.html?id=${prevArticle.id}`;
        document.getElementById('prevTitle').textContent = prevArticle.title;
        prevPost.style.display = 'flex';
    } else {
        prevPost.style.display = 'none';
    }
    
    // Find next article
    const nextArticle = extendedBlogArticles.find(a => a.id === current + 1);
    if (nextArticle) {
        nextPost.href = `blog-post.html?id=${nextArticle.id}`;
        document.getElementById('nextTitle').textContent = nextArticle.title;
        nextPost.style.display = 'flex';
    } else {
        nextPost.style.display = 'none';
    }
}

function initializeEventListeners() {
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Like button
    const likeBtn = document.getElementById('likeBtn');
    likeBtn.addEventListener('click', () => {
        likeBtn.classList.toggle('liked');
        const likeCount = document.getElementById('likeCount');
        const currentLikes = parseInt(likeCount.textContent);
        
        if (likeBtn.classList.contains('liked')) {
            likeCount.textContent = currentLikes + 1;
            likeBtn.querySelector('i').classList.remove('far');
            likeBtn.querySelector('i').classList.add('fas');
        } else {
            likeCount.textContent = currentLikes - 1;
            likeBtn.querySelector('i').classList.remove('fas');
            likeBtn.querySelector('i').classList.add('far');
        }
    });
    
    // Share button
    const shareBtn = document.getElementById('shareBtn');
    const shareModal = document.getElementById('shareModal');
    const closeShareModal = document.querySelector('.close-share-modal');
    
    shareBtn.addEventListener('click', () => {
        shareModal.classList.add('active');
    });
    
    closeShareModal.addEventListener('click', () => {
        shareModal.classList.remove('active');
    });
    
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            shareModal.classList.remove('active');
        }
    });
    
    // Copy link button
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyLinkBtn.innerHTML = '<i class="fas fa-link"></i> Copy Link';
                }, 2000);
            });
        });
    }
    
    // Bookmark button
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    bookmarkBtn.addEventListener('click', () => {
        bookmarkBtn.classList.toggle('bookmarked');
        const icon = bookmarkBtn.querySelector('i');
        
        if (bookmarkBtn.classList.contains('bookmarked')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
    });
    
    // Comment form
    const commentForm = document.getElementById('commentForm');
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const textarea = commentForm.querySelector('textarea');
        const nameInput = commentForm.querySelectorAll('input')[0];
        const emailInput = commentForm.querySelectorAll('input')[1];
        
        // Create new comment element
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.innerHTML = `
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50" alt="User" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-header">
                    <strong>${nameInput.value}</strong>
                    <span>Just now</span>
                </div>
                <p>${textarea.value}</p>
                <div class="comment-actions">
                    <button class="reply-btn">Reply</button>
                    <button class="like-comment-btn"><i class="far fa-heart"></i> 0</button>
                </div>
            </div>
        `;
        
        // Add to comments list
        const commentsList = document.getElementById('commentsList');
        commentsList.insertBefore(newComment, commentsList.firstChild);
        
        // Update comment count
        const commentCount = document.getElementById('commentCount');
        commentCount.textContent = parseInt(commentCount.textContent) + 1;
        
        // Reset form
        commentForm.reset();
        
        // Show success message
        alert('Thank you for your comment!');
    });
    
    // Newsletter forms
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            form.reset();
        });
    });
    
    // Category links
    document.querySelectorAll('.category-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            window.location.href = `index.html#blog?category=${category}`;
        });
    });
    
    // Search widget
    const searchWidget = document.querySelector('.search-widget');
    if (searchWidget) {
        const searchInput = searchWidget.querySelector('input');
        const searchButton = searchWidget.querySelector('button');
        
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `index.html?search=${encodeURIComponent(query)}`;
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
}

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}