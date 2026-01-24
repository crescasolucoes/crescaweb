gsap.registerPlugin(ScrollTrigger);


// 1. Hero Animations
const tl = gsap.timeline({
    onComplete: () => ScrollTrigger.refresh()
});

tl.to(".hero__title", { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
    .to(".hero__subtitle", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8")
    .to(".hero__actions", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8")
    // Animate SVG Assembly
    .to(".hero__abstract", { x: 0, opacity: 1, duration: 1 }, "-=1")
    .from(".wf-shell", { y: 50, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.5")
    .from(".wf-header", { y: -20, opacity: 0, duration: 0.6 }, "-=0.4")
    .from(".wf-hero > *", { scale: 0, opacity: 0, stagger: 0.1, duration: 0.6, transformOrigin: "center" }, "-=0.4")
    .from(".wf-grid > *", { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, "-=0.4")
    .from(".wf-code > *", { x: 50, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.6");




// 2. Horizontal Scroll Section (Services)
// Replaced by Swiper.js (slider.js) as requested
const servicesSection = document.getElementById("servicos");
if (servicesSection) {
    // Clean up any potential conflicts if standard scroll logic existed
}

// 3. Vertical Process Timeline
// Highlighting steps as they come into the center of the viewport
const steps = gsap.utils.toArray(".process-step");

steps.forEach((step, i) => {
    ScrollTrigger.create({
        trigger: step,
        start: "top 60%", // Trigger when top of element hits 60% of viewport
        end: "bottom 40%", // End when bottom of element hits 40% of viewport
        toggleClass: "active",
        // markers: true // debug
    });
});

// 4. KPI Counters
// Simple GSAP count up when in view
const kpis = document.querySelectorAll(".kpi strong");
kpis.forEach(kpi => {
    const target = parseInt(kpi.getAttribute("data-count"));
    const isPercentage = kpi.innerText.includes("%");
    const suffix = kpi.innerText.replace(/[0-9]/g, '');

    ScrollTrigger.create({
        trigger: kpi,
        start: "top 80%",
        once: true,
        onEnter: () => {
            gsap.to(kpi, {
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                onUpdate: function () {
                    kpi.innerText = Math.ceil(this.targets()[0].innerText) + suffix;
                }
            });
        }
    });
});

// 5. Contact Form Handler (Preserved functionality)
const form = document.getElementById('lead-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Enviando...";

        // Simulating 2024 tech response time
        setTimeout(() => {
            btn.innerText = "Recebido ✓";
            btn.style.background = "#22c55e";
            form.reset();
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "#fff";
            }, 3000);
        }, 1500);

        // Ideally here you send to API/Zapier
    });
}

function initCursorGlow() {
    const glow = document.querySelector(".cursor-glow");
    const hero = document.querySelector(".hero");

    if (!glow) {
        console.warn("Cursor glow or logo not found");
        return;
    }

    // Set initial state - Make it visible immediately for testing, or use logic
    gsap.set(glow, { xPercent: -50, yPercent: -50, opacity: 1 });

    window.addEventListener("mousemove", (e) => {
        gsap.to(glow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out",
            overwrite: "auto"
        });

        // if the scroll is out of home bounds, make the glow invisible
        if (hero.getBoundingClientRect().bottom < 0) {
            gsap.to(glow, {
                opacity: 0,
                duration: 0.1,
                ease: "power2.out",
                overwrite: "auto"
            });
        } else {
            gsap.to(glow, {
                opacity: 1,
                duration: 0.1,
                ease: "power2.out",
                overwrite: "auto"
            });
        }
    });
}

initCursorGlow();


// Header Scroll Effect (Glassmorphism)
const header = document.querySelector('.header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile Menu Toggle
const navToggle = document.querySelector('.nav__toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__link, .nav__cta');

if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}