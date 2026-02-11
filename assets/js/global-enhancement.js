
(function () {
    console.log("Global enhancement script loaded.");

    // --- Helper to get site name ---
    function getSiteName() {
        let title = document.title;
        if (title.includes('|')) return title.split('|')[0].trim();
        if (title.includes('-')) return title.split('-')[0].trim();
        return title.trim() || "Our Website";
    }
    const SITE_NAME = getSiteName();

    // --- Helper to get path depth ---
    // To link to assets/pages/about.html, we need to know how deep we are relative to root.
    // Standard: root/Niche/Site/index.html -> depth 2 -> ../../assets/pages/about.html
    // But some files might be deeper.
    // We can use absolute path if on a domain (Github Pages).
    // Or simpler: Find the `global-styles.css` link and use its base path.
    function getAssetsBasePath() {
        const cssLink = document.querySelector('link[href*="global-styles.css"]');
        if (cssLink) {
            const href = cssLink.getAttribute('href');
            // href is something like "../../assets/css/global-styles.css"
            // We want "../../assets/"
            return href.replace('css/global-styles.css', '');
        }
        return '../../assets/'; // Default fallback
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

    // 2. Responsive Layout Fixer
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

    // 3. Navigation Augmenter (Add About/Contact links)
    function enhanceNavigation() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        // Look for a link container. md:flex usually.
        const linkContainer = nav.querySelector('.hidden.md\\:flex') || nav.querySelector('ul.flex');

        if (linkContainer) {
            // Check if About Us already exists
            if (linkContainer.innerHTML.toLowerCase().includes('about')) return;

            const aboutUrl = `${ASSETS_BASE}pages/about.html?site=${encodeURIComponent(SITE_NAME)}`;
            const contactUrl = `${ASSETS_BASE}pages/contact.html?site=${encodeURIComponent(SITE_NAME)}`;

            // Create generic link style based on first existing link
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

            // Append wrapped in li if ul
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

    // 4. Footer Injector (If missing or small)
    function enhanceFooter() {
        const footer = document.querySelector('footer');
        // If footer doesn't exist, create one
        if (!footer) {
            const newFooter = document.createElement('footer');
            newFooter.className = "bg-gray-900 text-white py-12 mt-24";
            newFooter.innerHTML = `
            <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4">${SITE_NAME}</h3>
                    <p class="text-gray-400 text-sm">Empowering your digital presence with premium design.</p>
                </div>
                <div>
                    <h4 class="font-bold mb-4">Company</h4>
                    <ul class="space-y-2 text-sm text-gray-400">
                        <li><a href="${ASSETS_BASE}pages/about.html?site=${encodeURIComponent(SITE_NAME)}" class="hover:text-white">About Us</a></li>
                        <li><a href="#" class="hover:text-white">Careers</a></li>
                        <li><a href="#" class="hover:text-white">Press</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-4">Support</h4>
                    <ul class="space-y-2 text-sm text-gray-400">
                        <li><a href="${ASSETS_BASE}pages/contact.html?site=${encodeURIComponent(SITE_NAME)}" class="hover:text-white">Contact Center</a></li>
                        <li><a href="#" class="hover:text-white">Terms of Service</a></li>
                        <li><a href="#" class="hover:text-white">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-4">Stay Connected</h4>
                    <div class="flex space-x-4">
                        <a href="#" class="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-blue-600 transition-colors">F</a>
                        <a href="#" class="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-blue-400 transition-colors">T</a>
                        <a href="#" class="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-pink-600 transition-colors">I</a>
                    </div>
                </div>
            </div>
          `;
            document.body.appendChild(newFooter);
        }
    }

    // 5. Mobile Menu (Original)
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initMobileMenu();
            enhanceNavigation();
            enhanceFooter();
            // Wait a bit for other scripts to render
            setTimeout(fixLayout, 100);
        });
    } else {
        initMobileMenu();
        enhanceNavigation();
        enhanceFooter();
        fixLayout();
    }

    window.addEventListener('resize', fixLayout);

})();
