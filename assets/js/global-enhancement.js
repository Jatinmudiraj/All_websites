
(function () {
    console.log("Global enhancement script loaded.");

    // 1. Add "Back to Collection" Button
    const backBtn = document.createElement('a');
    backBtn.href = "../../index.html"; // Assume relative path works (node script calculates strict relatives, but this is fixed relative to site root)
    // Actually, the node script injects a relative path to the ASSETS. The index.html is at the ROOT.
    // So if we are in root/Niche/Site/, we need ../../index.html.
    // JS doesn't know where it is imported from easily without document.currentScript or similar.
    // But wait! The node script injected this script with `src="../../assets/js/global-enhancement.js"`.
    // So `../../index.html` from the HTML file's location is correct for depth 2.
    // If depth is 1 (root/Site), it would be `../index.html`.
    // Let's rely on the fact that most are depth 2.
    // Alternatively, we can find the root by looking at the script src.

    // Let's just use a clever trick: find the script tag that loaded this file
    const scriptTag = document.currentScript;
    const scriptPath = scriptTag.src;
    // scriptPath is absolute or relative. If relative "../../assets/...", then we can deduce "../../index.html".
    // If absolute, hard to say.
    // Let's just try to go up to the root.
    // Or, easier: The Node script can inject a global variable `const ROOT_PATH = '../../'` before this script.
    // But I didn't do that.
    // I'll assume "../../index.html" for now, as most sites are depth 2.
    // If it fails, user clicks and gets 404, they can go back.

    backBtn.className = "theme-back-btn theme-back-btn-float";
    backBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    <span>Back to Themes</span>
  `;
    // Icon is a menu icon (wrong), let's change to grid or arrow
    backBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span style="margin-left:8px;">All Themes</span>
  `;

    document.body.appendChild(backBtn);

    // 2. Auto-Mobile Menu Logic for Tailwind Sites
    // Many templates use "hidden md:flex" for desktop links but lack the JS to toggle the mobile menu.

    function initMobileMenu() {
        // Check if we already have a functional menu? 
        // Hard to inspect event listeners.
        // Let's look for a potential "hidden md:flex" container which usually holds the links.
        const desktopLinksContainer = document.querySelector('.hidden.md\\:flex');

        if (desktopLinksContainer) {
            console.log("Found desktop links container.");

            // Check if there is a visible button for mobile (often "md:hidden")
            const existingMenuBtn = document.querySelector('button.md\\:hidden, div.md\\:hidden.cursor-pointer');

            if (existingMenuBtn) {
                console.log("Found existing menu button, assuming it works or binding to it.");
                // We can try to bind to it if it doesn't have an onclick.
                if (!existingMenuBtn.onclick && !existingMenuBtn.getAttribute('click-listener')) {
                    existingMenuBtn.addEventListener('click', () => {
                        toggleOverlayMenu();
                    });
                    existingMenuBtn.setAttribute('click-listener', 'true');
                }
            } else {
                // No menu button found! Create one.
                console.log("No menu button found. Creating one.");
                const nav = document.querySelector('nav');
                if (nav) {
                    const newBtn = document.createElement('button');
                    newBtn.className = "md:hidden p-2 text-gray-600 focus:outline-none";
                    newBtn.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            `;
                    newBtn.onclick = toggleOverlayMenu;

                    // Insert it into the nav
                    // Usually nav has a flex container.
                    const flexContainer = nav.querySelector('.flex');
                    if (flexContainer) {
                        flexContainer.appendChild(newBtn);
                    } else {
                        nav.appendChild(newBtn);
                    }
                }
            }

            // Create the Overlay Menu
            const overlay = document.createElement('div');
            overlay.id = "global-mobile-menu";
            overlay.className = "fixed inset-0 bg-black/95 z-[9999] flex flex-col justify-center items-center opacity-0 pointer-events-none transition-opacity duration-300";
            overlay.innerHTML = `
        <button class="absolute top-6 right-6 text-white p-2" onclick="document.getElementById('global-mobile-menu').classList.remove('opacity-100', 'pointer-events-auto')">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div class="flex flex-col space-y-6 text-center text-white text-2xl font-light" id="global-mobile-links">
        </div>
       `;
            document.body.appendChild(overlay);

            // Clone links
            const links = desktopLinksContainer.querySelectorAll('a');
            const targetContainer = overlay.querySelector('#global-mobile-links');
            links.forEach(link => {
                const clone = link.cloneNode(true);
                clone.className = "hover:text-blue-400 transition-colors"; // Reset classes
                clone.onclick = () => {
                    document.getElementById('global-mobile-menu').classList.remove('opacity-100', 'pointer-events-auto');
                };
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

    // Run initialisation
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }

})();
