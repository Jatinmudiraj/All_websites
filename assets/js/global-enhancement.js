
(function () {
    console.log("🎨 Global Design Enhancement Engine Activated");

    // --- Helper Functions ---
    function getSiteName() {
        let title = document.title;
        if (title.includes('|')) return title.split('|')[0].trim();
        if (title.includes('-')) return title.split('-')[0].trim();
        return title.trim() || "Our Website";
    }
    const SITE_NAME = getSiteName();

    function getAssetsBasePath() {
        const cssLink = document.querySelector('link[href*="global-styles.css"]');
        if (cssLink) {
            const href = cssLink.getAttribute('href');
            return href.replace('css/global-styles.css', '');
        }
        return '../../assets/';
    }
    const ASSETS_BASE = getAssetsBasePath();

    // 1. Add "Back to Collection" Button
    let backBtn = document.createElement('a');
    backBtn.href = ASSETS_BASE.replace('assets/', '') + "index.html";
    backBtn.className = "theme-back-btn theme-back-btn-float";
    backBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span style="margin-left:8px;">All Themes</span>
  `;
    document.body.appendChild(backBtn);

    // 2. Enhanced Responsive Layout Fixer
    function fixLayout() {
        const width = window.innerWidth;
        const potentialContainers = document.querySelectorAll('body > main, body > section, body > div.container');
        potentialContainers.forEach(el => {
            if (!el.className.includes('max-w-')) {
                if (width > 1024) {
                    el.classList.add('max-w-7xl', 'mx-auto', 'px-4');
                }
            }
        });

        const flexRows = document.querySelectorAll('.flex:not(.flex-wrap):not(.flex-col)');
        flexRows.forEach(row => {
            if (row.children.length > 3 && row.scrollWidth > row.clientWidth) {
                if (width > 1024 && !row.classList.contains('hide-scrollbar')) {
                    row.classList.add('flex-wrap', 'gap-4', 'justify-center');
                    row.classList.remove('overflow-x-auto');
                }
            }
        });

        const navs = document.querySelectorAll('nav, header');
        navs.forEach(nav => {
            if (nav.children.length > 0) {
                let directChild = nav.firstElementChild;
                if (!directChild.className.includes('max-w-') && !directChild.className.includes('container')) {
                    if (width > 1024) {
                        directChild.classList.add('max-w-7xl', 'mx-auto', 'px-6');
                    }
                }
            }
        });
    }

    // 3. Navigation Augmenter
    function enhanceNavigation() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        const linkContainer = nav.querySelector('.hidden.md\\:flex') || nav.querySelector('ul.flex');

        if (linkContainer) {
            if (linkContainer.innerHTML.toLowerCase().includes('about')) return;

            const aboutUrl = `${ASSETS_BASE}pages/about.html?site=${encodeURIComponent(SITE_NAME)}`;
            const contactUrl = `${ASSETS_BASE}pages/contact.html?site=${encodeURIComponent(SITE_NAME)}`;

            const existingLink = linkContainer.querySelector('a');
            const className = existingLink ? existingLink.className : 'hover:text-blue-500 transition-colors font-medium';

            const aboutLink = document.createElement('a');
            aboutLink.href = aboutUrl;
            aboutLink.className = className;
            aboutLink.textContent = "About";

            const contactLink = document.createElement('a');
            contactLink.href = contactUrl;
            contactLink.className = className;
            contactLink.textContent = "Contact";

            if (linkContainer.tagName === 'UL') {
                const li1 = document.createElement('li'); li1.appendChild(aboutLink);
                const li2 = document.createElement('li'); li2.appendChild(contactLink);
                linkContainer.appendChild(li1);
                linkContainer.appendChild(li2);
            } else {
                linkContainer.appendChild(aboutLink);
                linkContainer.appendChild(contactLink);
            }
        }
    }

    // 4. Enhanced Footer
    function enhanceFooter() {
        const footer = document.querySelector('footer');
        if (!footer || footer.innerText.length < 50) {
            if (footer) footer.remove();

            const newFooter = document.createElement('footer');
            newFooter.className = "bg-gradient-to-b from-gray-900 to-black text-white py-16 mt-24";
            newFooter.innerHTML = `
            <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">${SITE_NAME}</h3>
                    <p class="text-gray-400 text-sm leading-relaxed">Empowering your digital presence with premium design and cutting-edge technology.</p>
                </div>
                <div>
                    <h4 class="font-bold mb-4 text-lg">Company</h4>
                    <ul class="space-y-3 text-sm text-gray-400">
                        <li><a href="${ASSETS_BASE}pages/about.html?site=${encodeURIComponent(SITE_NAME)}" class="hover:text-white hover:translate-x-1 inline-block transition-all">About Us</a></li>
                        <li><a href="#" class="hover:text-white hover:translate-x-1 inline-block transition-all">Careers</a></li>
                        <li><a href="#" class="hover:text-white hover:translate-x-1 inline-block transition-all">Press Kit</a></li>
                        <li><a href="#" class="hover:text-white hover:translate-x-1 inline-block transition-all">Blog</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-4 text-lg">Support</h4>
                    <ul class="space-y-3 text-sm text-gray-400">
                        <li><a href="${ASSETS_BASE}pages/contact.html?site=${encodeURIComponent(SITE_NAME)}" class="hover:text-white hover:translate-x-1 inline-block transition-all">Contact Us</a></li>
                        <li><a href="#" class="hover:text-white hover:translate-x-1 inline-block transition-all">Help Center</a></li>
                        <li><a href="#" class="hover:text-white hover:translate-x-1 inline-block transition-all">Terms of Service</a></li>
                        <li><a href="#" class="hover:text-white hover:translate-x-1 inline-block transition-all">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-4 text-lg">Stay Connected</h4>
                    <div class="flex space-x-4 mb-6">
                        <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110 hover:-rotate-6">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-all hover:scale-110 hover:-rotate-6">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                        </a>
                        <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-all hover:scale-110 hover:-rotate-6">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                        </a>
                    </div>
                    <p class="text-xs text-gray-500">© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
                </div>
            </div>
          `;
            document.body.appendChild(newFooter);
        }
    }

    // 5. Mobile Menu
    function initMobileMenu() {
        const desktopLinksContainer = document.querySelector('.hidden.md\\:flex');
        if (desktopLinksContainer) {
            const existingMenuBtn = document.querySelector('button.md\\:hidden, div.md\\:hidden.cursor-pointer');
            if (existingMenuBtn) {
                if (!existingMenuBtn.onclick && !existingMenuBtn.getAttribute('click-listener')) {
                    existingMenuBtn.addEventListener('click', toggleOverlayMenu);
                    existingMenuBtn.setAttribute('click-listener', 'true');
                }
            } else {
                const nav = document.querySelector('nav');
                if (nav) {
                    const newBtn = document.createElement('button');
                    newBtn.className = "md:hidden p-2 text-gray-600 focus:outline-none";
                    newBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`;
                    newBtn.onclick = toggleOverlayMenu;
                    const flexContainer = nav.querySelector('.flex');
                    if (flexContainer) flexContainer.appendChild(newBtn);
                    else nav.appendChild(newBtn);
                }
            }

            const overlay = document.createElement('div');
            overlay.id = "global-mobile-menu";
            overlay.className = "fixed inset-0 bg-black/95 z-[9999] flex flex-col justify-center items-center opacity-0 pointer-events-none transition-opacity duration-300";
            overlay.innerHTML = `
        <button class="absolute top-6 right-6 text-white p-2" onclick="document.getElementById('global-mobile-menu').classList.remove('opacity-100', 'pointer-events-auto')">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div class="flex flex-col space-y-6 text-center text-white text-2xl font-light" id="global-mobile-links"></div>
       `;
            document.body.appendChild(overlay);

            const links = desktopLinksContainer.querySelectorAll('a');
            const targetContainer = overlay.querySelector('#global-mobile-links');
            links.forEach(link => {
                const clone = link.cloneNode(true);
                clone.className = "hover:text-blue-400 transition-colors";
                clone.onclick = () => document.getElementById('global-mobile-menu').classList.remove('opacity-100', 'pointer-events-auto');
                targetContainer.appendChild(clone);
            });
        }
    }

    function toggleOverlayMenu() {
        const overlay = document.getElementById('global-mobile-menu');
        if (overlay) {
            overlay.classList.toggle('opacity-100');
            overlay.classList.toggle('pointer-events-auto');
        }
    }

    // 6. Advanced Scroll Animations
    function initScrollAnimations() {
        const style = document.createElement('style');
        style.innerHTML = `
           .reveal-on-scroll {
               opacity: 0;
               transform: translateY(30px);
               transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
               will-change: opacity, transform;
           }
           .reveal-on-scroll.is-visible {
               opacity: 1;
               transform: translateY(0);
           }
           .reveal-left {
               opacity: 0;
               transform: translateX(-30px);
               transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
           }
           .reveal-left.is-visible {
               opacity: 1;
               transform: translateX(0);
           }
           .reveal-right {
               opacity: 0;
               transform: translateX(30px);
               transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
           }
           .reveal-right.is-visible {
               opacity: 1;
               transform: translateX(0);
           }
           .reveal-scale {
               opacity: 0;
               transform: scale(0.9);
               transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
           }
           .reveal-scale.is-visible {
               opacity: 1;
               transform: scale(1);
           }
       `;
        document.head.appendChild(style);

        const elements = document.querySelectorAll('h1, h2, h3, p, img, section > div, .card, article');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, index * 50);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        elements.forEach((el, index) => {
            const animations = ['reveal-on-scroll', 'reveal-left', 'reveal-right', 'reveal-scale'];
            const randomAnimation = animations[index % animations.length];
            el.classList.add(randomAnimation);
            observer.observe(el);
        });
    }

    // 7. Image Lazy Loading Enhancement
    function enhanceImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }

            // Add gradient overlay class to images in cards
            if (img.closest('.card') || img.closest('[class*="card"]')) {
                const wrapper = img.parentElement;
                if (wrapper) {
                    wrapper.classList.add('gradient-overlay');
                }
            }
        });
    }

    // 8. CTA Button Enhancement
    function enhanceCTAs() {
        const ctaButtons = document.querySelectorAll('button, a[class*="btn"], a[class*="button"]');
        ctaButtons.forEach(btn => {
            const text = btn.textContent.toLowerCase();
            if (text.includes('download') || text.includes('get started') || text.includes('sign up') || text.includes('buy')) {
                btn.classList.add('pulse-cta');
            }
        });
    }

    // Initialize all enhancements
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initMobileMenu();
            enhanceNavigation();
            enhanceFooter();
            enhanceImages();
            enhanceCTAs();
            setTimeout(() => {
                fixLayout();
                initScrollAnimations();
            }, 100);
        });
    } else {
        initMobileMenu();
        enhanceNavigation();
        enhanceFooter();
        enhanceImages();
        enhanceCTAs();
        fixLayout();
        initScrollAnimations();
    }

    window.addEventListener('resize', fixLayout);

    console.log("✨ All design enhancements applied successfully!");

})();
