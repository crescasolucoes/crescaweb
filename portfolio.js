// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

console.log("Portfolio JS Loaded");

// Animation Configuration
const config = {
    duration: 1,
    ease: "power2.inOut"
};

async function initPortfolio() {

    // 1. Fetch Data
    try {
        const response = await fetch('assets/portfolio.json');
        const projects = await response.json();

        const container = document.getElementById('projects-container');

        // 2. Render Projects
        projects.forEach((proj, index) => {
            const section = document.createElement('section');
            section.className = 'project-card-section';
            section.id = `project-${index}`;

            // Logic for button
            let btnHtml = '';
            if (proj.live_link) {
                btnHtml = `<a href="${proj.live_link}" target="_blank" rel="noopener" class="p-btn">Ver ao vivo ↗</a>`;
            } else {
                btnHtml = `<span class="p-btn" style="opacity:0.5; cursor: default;">Em Breve</span>`;
            }

            section.innerHTML = `
                <div class="project-card">
                    <div class="project-info">
                        <div>
                            <div class="project-meta">
                                <span>${proj.category_1}</span> — <span>${proj.category_2}</span>
                            </div>
                            <h2 class="p-title-huge" style="font-size: 4rem; margin-bottom: 1rem;">${proj.title}</h2>
                            <p class="p-subtitle">
                                ${proj.description}
                            </p>
                        </div>
                        ${btnHtml}
                    </div>
                    <div class="project-visual">
                        <img src="${proj.image}" alt="${proj.title}" data-parallax-speed="1.1" class="clickable-image" data-full="${proj.image}">
                    </div>
                </div>
            `;
            container.appendChild(section);
        });

        // Initialize Modal Logic
        initModal();

        // 3. Initialize GSAP Animations AFTER render
        initAnimations();

    } catch (error) {
        console.error("Failed to load portfolio data:", error);
    }
}

function initModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('p-modal-img');
    const closeBtn = document.querySelector('.p-modal-close');
    const content = document.querySelector('.p-modal-content');
    const triggers = document.querySelectorAll('.clickable-image'); // Images inside project cards

    if (!modal) return;

    triggers.forEach(img => {
        img.parentElement.addEventListener('click', (e) => {
            // Prevent if clicking on something else inside (though visual only has img)
            modalImg.src = img.src; // Or use dataset.full if you have higher res version
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scroll
        });
    });

    // Close logic
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset zoom
        content.classList.remove('zoomed');
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Zoom Toggle
    content.addEventListener('click', () => {
        content.classList.toggle('zoomed');
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

function initAnimations() {
    // Hero Animation - Reveal text
    gsap.from(".intro .p-logo-hero", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.1
    });

    gsap.from(".intro h1", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.2
    });

    gsap.from(".intro p", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.4
    });

    // --- NEW: Hero Scroll Exit/Enter Animation ---
    gsap.to(".intro div", {
        scrollTrigger: {
            trigger: ".intro",
            start: "top top",      // Start when top of intro hits top of viewport
            end: "bottom top",     // End when bottom of intro hits top of viewport
            scrub: true            // Smoothly scrub animation with scroll
        },
        y: -100,             // Move up
        opacity: 0,          // Fade out
        scale: 0.9,          // Shrink slightly
        filter: "blur(10px)", // Blur out
        ease: "none"
    });

    // Project Cards Stacking Effect (Desktop Only)
    // We use matchMedia to disable the pinning/stacking on mobile for smoother native scroll
    ScrollTrigger.matchMedia({

        // Desktop
        "(min-width: 900px)": function () {
            const sections = gsap.utils.toArray(".project-card-section");

            sections.forEach((section, i) => {
                const card = section.querySelector(".project-card");
                const image = section.querySelector(".project-visual img");

                // Parallax Effect for Images
                if (image) {
                    gsap.to(image, {
                        yPercent: 15,
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    });
                }

                // Pinning Logic
                ScrollTrigger.create({
                    trigger: section,
                    start: "top top",
                    pin: true,
                    pinSpacing: true,
                    end: "bottom top",
                    onUpdate: (self) => {
                        if (self.progress > 0) {
                            gsap.set(card, {
                                scale: 1 - (self.progress * 0.1),
                                opacity: 1 - (self.progress * 0.5),
                                transformOrigin: "center center"
                            });
                        }
                    }
                });
            });
        },

        // Mobile (Optional cleanup or simpler effects if needed)
        "(max-width: 899px)": function () {
            // On mobile, we let them scroll naturally.
            // We can strictly reset ensuring no artifacts remain.
            gsap.set(".project-card", { clearProps: "all" });
        }
    });
}

function initCursorGlow() {
    const glow = document.querySelector(".cursor-glow");
    const logo = document.querySelector(".p-logo-hero");

    if (!glow || !logo) {
        console.warn("Cursor glow or logo not found");
        return;
    }

    // Set initial state
    gsap.set(glow, { xPercent: -50, yPercent: -50, opacity: 0 });

    window.addEventListener("mousemove", (e) => {
        // Move tracking - Using standard gsap.to for reliability
        gsap.to(glow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out",
            overwrite: "auto"
        });

        // Proximity Logic
        // Calculate distance to logo
        const rect = logo.getBoundingClientRect();
        const logoCenterX = rect.left + rect.width / 2;
        const logoCenterY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - logoCenterX, e.clientY - logoCenterY);

        const maxDist = 700; // Increased radius for visibility

        if (dist < maxDist) {
            const intensity = 1 - (dist / maxDist); // 0 to 1
            gsap.to(glow, {
                opacity: intensity * 0.6, // Max opacity 0.6
                scale: 1 + (intensity * 0.5), // Scale up as you get closer
                duration: 0.2,
                overwrite: "auto"
            });
        } else {
            gsap.to(glow, {
                opacity: 0,
                scale: 0.5,
                duration: 0.5,
                overwrite: "auto"
            });
        }
    });
}

// Start
// --- Presentation Mode Logic (For Video Recording) ---
function initPresentationMode() {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('mode') || urlParams.get('mode') !== 'presentation') return;

    // 1. UI Cleanup Class
    document.body.classList.add('presentation-mode');
    console.log("🎥 Presentation Mode Active");

    // 2. Auto Scroll Logic
    const speed = 2; // Pixels per tick
    let scrollPos = 0;

    // Disable user scroll interaction to prevent jitter
    document.body.style.overflow = 'hidden';

    function autoScroll() {
        scrollPos += speed;
        // Native window scroll for GSAP ScrollTrigger compatibility
        window.scrollTo(0, scrollPos);

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        // Loop or Stop at bottom
        if (scrollPos < maxScroll) {
            requestAnimationFrame(autoScroll);
        } else {
            console.log("🎥 Scene Finished");
        }
    }

    // specific trigger delay to allow recording software to start
    setTimeout(() => {
        autoScroll();
    }, 2000); // 2s delay start
}

// Start
initPresentationMode();
initCursorGlow();
initPortfolio();

// Navbar Interaction
let lastScroll = 0;
window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 100) {
        document.querySelector(".p-nav").style.transform = "translateY(-100%)";
    } else {
        document.querySelector(".p-nav").style.transform = "translateY(0)";
    }
    document.querySelector(".p-nav").style.transition = "transform 0.4s ease";
    lastScroll = currentScroll;
});
