/**
 * SLASH-ROOT Guide Page JavaScript
 * Utilities for enhanced guide page functionality
 */

// ============================================
// Theme Toggle (same as homepage)
// ============================================
function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-icon');
    const currentTheme = html.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        html.removeAttribute('data-theme');
        if (icon) icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        if (icon) icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const icon = document.getElementById('theme-icon');
    
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (icon) icon.className = 'fas fa-sun';
    }
}

// ============================================
// Copy Code to Clipboard
// ============================================
function initCopyButtons() {
    // Find all code blocks and add copy buttons
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach((block, index) => {
        // Wrap in a container if not already
        if (!block.parentElement.classList.contains('code-block')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block';
            block.parentNode.insertBefore(wrapper, block);
            wrapper.appendChild(block);
        }
        
        // Create copy button
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.innerHTML = '<i class="fas fa-copy"></i> Copy';
        button.setAttribute('data-index', index);
        
        // Add click handler
        button.addEventListener('click', function() {
            const code = block.textContent;
            copyToClipboard(code, this);
        });
        
        // Add button to wrapper
        block.parentElement.insertBefore(button, block);
    });
}

function copyToClipboard(text, button) {
    // Try using the Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess(button);
        }).catch(() => {
            // Fallback to older method
            fallbackCopy(text, button);
        });
    } else {
        fallbackCopy(text, button);
    }
}

function fallbackCopy(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(button);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
    
    document.body.removeChild(textarea);
}

function showCopySuccess(button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.classList.add('copied');
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('copied');
    }, 2000);
}

// ============================================
// Table of Contents Active State
// ============================================
function initTOCHighlight() {
    const sections = document.querySelectorAll('.guide-section[id]');
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    if (sections.length === 0 || tocLinks.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove active class from all links
                tocLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current link
                const activeLink = document.querySelector(`.toc-list a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: '-100px 0px -70% 0px',
        threshold: 0
    });
    
    sections.forEach(section => observer.observe(section));
}

// ============================================
// Back to Top Button
// ============================================
function initBackToTop() {
    // Reuse existing button if present in HTML; otherwise create one
    let backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
    }
    backToTopBtn.setAttribute('aria-label', 'Back to top');

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// Smooth Scrolling for Anchor Links
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Image Zoom (optional - simple implementation)
// ============================================
function initImageZoom() {
    const images = document.querySelectorAll('.guide-image');
    
    images.forEach(img => {
        img.addEventListener('click', function() {
            // Create modal overlay
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: zoom-out;
            `;
            
            // Create enlarged image
            const enlargedImg = document.createElement('img');
            enlargedImg.src = this.src;
            enlargedImg.alt = this.alt;
            enlargedImg.style.cssText = `
                max-width: 95%;
                max-height: 95%;
                object-fit: contain;
            `;
            
            modal.appendChild(enlargedImg);
            document.body.appendChild(modal);
            
            // Close on click
            modal.addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            // Close on escape key
            document.addEventListener('keydown', function closeOnEscape(e) {
                if (e.key === 'Escape' && document.body.contains(modal)) {
                    document.body.removeChild(modal);
                    document.removeEventListener('keydown', closeOnEscape);
                }
            });
        });
    });
}

// ============================================
// Reading Progress Bar (optional)
// ============================================
function initProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ============================================
// External Links - Open in New Tab
// ============================================
function initExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
        if (!link.hostname.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

// ============================================
// Print Button (optional)
// ============================================
function initPrintButton() {
    const guideHeader = document.querySelector('.guide-header');
    if (!guideHeader) return;
    
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '<i class="fas fa-print"></i> Print Guide';
    printBtn.style.cssText = `
        background-color: var(--secondary-bg);
        border: 1px solid var(--border-color);
        color: var(--primary-text);
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.15s ease;
        float: right;
    `;
    
    printBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'var(--hover-bg)';
    });
    
    printBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'var(--secondary-bg)';
    });
    
    printBtn.addEventListener('click', () => {
        window.print();
    });
    
    guideHeader.appendChild(printBtn);
}

// ============================================
// Footer normalization (compact footer with logo + email)
// ============================================
function replaceFooter() {
    const container = document.querySelector('.site-footer .container');
    if (!container) return;
    container.innerHTML = `
        <div class="footer-compact">
            <div class="footer-brand">
                <i class="fas fa-atom"></i>
                <span>Quantum Repository</span>
            </div>
            <div class="footer-contact">
                <a href="mailto:alex@slash-root.com">alex@slash-root.com</a>
            </div>
        </div>
    `;
}

// ============================================
// Initialize Theme Toggle
// ============================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = document.getElementById('theme-icon');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            
            if (currentTheme === 'light') {
                html.removeAttribute('data-theme');
                if (icon) icon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'dark');
            } else {
                html.setAttribute('data-theme', 'light');
                if (icon) icon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

// ============================================
// Initialize All Features
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    initThemeToggle();
    initCopyButtons();
    initTOCHighlight();
    initBackToTop();
    initSmoothScroll();
    initImageZoom();
    initProgressBar();
    initExternalLinks();
    initPrintButton();
    replaceFooter();
    
    console.log('✓ Guide utilities initialized');
});

// ============================================
// Keyboard Shortcuts (optional)
// ============================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + P for print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        // Let default print work
    }
    
    // Escape to close any modals
    if (e.key === 'Escape') {
        // Close any open modals
    }
});
