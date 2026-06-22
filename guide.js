/**
 * Quantum Repository - Guide Page JavaScript
 * Utilities for enhanced guide page functionality
 */

// ============================================
// Theme Management
// ============================================
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const icon = document.getElementById('theme-icon');
    
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (icon) icon.className = 'fas fa-sun';
    }
}

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
// Copy Code to Clipboard
// ============================================
function initCopyButtons() {
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
        
        button.addEventListener('click', function() {
            const code = block.textContent;
            copyToClipboard(code, this);
        });
        
        block.parentElement.insertBefore(button, block);
    });
}

function copyToClipboard(text, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess(button);
        }).catch((err) => {
            console.error('Failed to copy:', err);
        });
    }
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
// Back to Top Button
// ============================================
function initBackToTop() {
    let backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
    }
    backToTopBtn.setAttribute('aria-label', 'Back to top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

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
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Reading Progress Bar
// ============================================
function initProgressBar() {
    // Reuse existing element if present, otherwise create one
    let progressBar = document.querySelector('.reading-progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        document.body.prepend(progressBar);
    }
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    
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
// Footer normalization (compact footer with logo + email)
// Uses DOM APIs instead of innerHTML so this stays safe even if any of the
// values below ever become user-influenced.
// ============================================
function replaceFooter() {
    const container = document.querySelector('.site-footer .container');
    if (!container) return;

    // Wipe whatever the page shipped with.
    while (container.firstChild) container.removeChild(container.firstChild);

    const compact = document.createElement('div');
    compact.className = 'footer-compact';

    const brand = document.createElement('div');
    brand.className = 'footer-brand';
    const icon = document.createElement('i');
    icon.className = 'fas fa-atom';
    icon.setAttribute('aria-hidden', 'true');
    const brandText = document.createElement('span');
    brandText.textContent = 'Quantum Repository';
    brand.append(icon, brandText);

    const contact = document.createElement('div');
    contact.className = 'footer-contact';
    const mail = document.createElement('a');
    mail.href = 'mailto:alex@slash-root.com';
    mail.textContent = 'alex@slash-root.com';
    contact.appendChild(mail);

    // Dynamic copyright year alongside the contact info.
    const year = document.createElement('span');
    year.className = 'footer-year';
    year.textContent = `\u00A9 ${new Date().getFullYear()}`;
    contact.appendChild(year);

    compact.append(brand, contact);
    container.appendChild(compact);
}

// ============================================
// Footer year span (for pages that didn't have replaceFooter() applied)
// ============================================
function initFooterYear() {
    const span = document.getElementById('footer-year');
    if (span) span.textContent = new Date().getFullYear();
}

// ============================================
// Initialize All Features
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    initThemeToggle();
    initCopyButtons();
    initBackToTop();
    initSmoothScroll();
    initProgressBar();
    initExternalLinks();
    initFooterYear();
    replaceFooter();
});
