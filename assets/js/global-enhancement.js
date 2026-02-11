
(function () {
    console.log("Global enhancement script loaded.");

    // 1. Add "Back to Collection" Button
    let backBtn = document.createElement('a');
    backBtn.href = "../../index.html";

    // Try to find the root path if "currentScript" attribute exists on any element
    // Or just guess based on location.pathname depth?
    // Most sites are: /Niche/Site/index.html -> depth 2 -> ../../
    // Some might be /Niche/Site/extracted/index.html -> depth 3?
    // Let's count slashes relative to "All_websites" or "All_website_theme" in pathname?
    // Hard if run locally vs github pages.
    // Best heuristic: Just ../../ works for 90% sites.
    // Let's be smart: search for "All_websites" in pathname and count depth.

    const pathParts = window.location.pathname.split('/');
    const rootIndex = pathParts.findIndex(p => p === 'All_website_theme' || p === 'All_websites');
    let upLevel = 2;
    if (rootIndex !== -1) {
        upLevel = pathParts.length - 1 - rootIndex - 1;
        // e.g. /.../root/Niche/Site/index.html -> length=N, rootIndex=N-3. 
        // upLevel = (N-1) - (N-3) - 1 = 1 ??? No.
        // root/Niche/Site/index.html -> 3 levels deep from root (Niche, Site, index).
        // need 2 ups (../..) to get to root.
        // Actually, root is directory containing index.html.
        // So if path is .../root/index.html -> 0 ups.
        // if path is .../root/Niche/index.html -> 1 up.
        // if path is .../root/Niche/Site/index.html -> 2 ups.
        // Depth = pathParts.length - (rootIndex + 1); // +1 because rootIndex is directory itself
        // If index.html is counted, depth is inclusive.
        // Let's stick with ../../ as default.
    }

    backBtn.className = "theme-back-btn theme-back-btn-float";
    backBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span style="margin-left:8px;">All Themes</span>
  `;
    document.body.appendChild(backBtn);

    // 2. Responsive Layout Fixer (NEW)
    // Fix full-width mobile designs on desktop

    function fixLayout() {
        const width = window.innerWidth;

        // Target main containers lacking constraint
        // Exclude if already has max-w class
        const potentialContainers = document.querySelectorAll('body > main, body > section, body > div.container');

        potentialContainers.forEach(el => {
            if (!el.className.includes('max-w-')) {
                if (width > 1024) {
                    // Force a constraint
                    el.classList.add('max-w-7xl', 'mx-auto', 'px-4');
                    // px-4 prevents edge-touching after max-width constraint
                }
            }
        });

        // Fix Specific "Grid" issues if undetected by regex script
        // e.g. Flex containers that should wrap or grid
        // Detected via many children + horizontal overflow
        // Just a heuristic:
        // Find all flex containers with > 3 children and NO flex-wrap
        const flexRows = document.querySelectorAll('.flex:not(.flex-wrap):not(.flex-col)');
        flexRows.forEach(row => {
            if (row.children.length > 3 && row.scrollWidth > row.clientWidth) {
                // It's scrolling horizontally (carousel-like). On desktop, maybe grid?
                // Only if width > 1024
                if (width > 1024 && !row.classList.contains('hide-scrollbar')) { // If explicitly hidden scrollbar, it's intended carousel
                    row.classList.add('flex-wrap', 'gap-4', 'justify-center');
                    // Remove overflow-x-auto if present to avoid dual behavior?
                    row.classList.remove('overflow-x-auto');
                }
            }
        });

        // Fix Navigation Bar Full Width
        // Often navs are "fixed w-full". We want content inside to be centered.
        const navs = document.querySelectorAll('nav, header');
        navs.forEach(nav => {
            // Check if direct children are fluid
            if (nav.children.length > 0) {
                let directChild = nav.firstElementChild;
                if (!directChild.className.includes('max-w-') && !directChild.className.includes('container')) {
                    if (width > 1024) {
                        directChild.classList.add('max-w-7xl', 'mx-auto', 'px-6');
                        // Ensure nav has background so it spans full width
                        // (usually already has bg class)
                    }
                }
            }
        });
    }

    // 3. Auto-Mobile Menu Logic (Previous)
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
            fixLayout();
        });
    } else {
        initMobileMenu();
        fixLayout();
    }

    window.addEventListener('resize', fixLayout);

})();
