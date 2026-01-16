(function () {
    const FORM_ENDPOINT = ""; // ex: https://formspree.io/f/xxxxxxx
    const WHATSAPP_NUMBER = "5584991659966";

    function createMarkup(root, initialState) {
        const state = new Proxy(initialState || {}, {
            set(target, prop, value) {
                target[prop] = value;
                queueUpdate();
                return true;
            },
        });

        let raf = null;
        function queueUpdate() {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = null;
                update();
            });
        }

        const repeatNodes = Array.from(root.querySelectorAll("[data-repeat]"));
        const repeatTemplates = repeatNodes.map((node) => {
            const key = node.getAttribute("data-repeat");
            const tpl = node.cloneNode(true);
            const parent = node.parentElement;
            parent.removeChild(node);
            return { parent, key, tpl };
        });

        function bindInto(scopeRoot, scope) {
            scopeRoot.querySelectorAll("[data-bind]").forEach((el) => {
                const key = el.getAttribute("data-bind");
                const val = key.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), scope);
                if (val == null) {
                    el.textContent = "";
                } else {
                    el.textContent = String(val);
                }
            });
        }

        function renderRepeats() {
            repeatTemplates.forEach(({ parent, key, tpl }) => {
                parent.querySelectorAll(`[data-repeat-rendered="${key}"]`).forEach((n) => n.remove());
                const items = state[key] || [];
                items.forEach((item) => {
                    const node = tpl.cloneNode(true);
                    node.setAttribute("data-repeat-rendered", key);
                    node.removeAttribute("data-repeat");
                    bindInto(node, item);
                    parent.appendChild(node);
                });
            });
        }

        function updateBinds() {
            root.querySelectorAll("[data-bind]").forEach((el) => {
                if (el.closest("[data-repeat-rendered]")) return; // handled in repeat
                const key = el.getAttribute("data-bind");
                const val = key.split(".").reduce((acc, k) => (acc ? acc[k] : state[k]), state);
                el.textContent = val == null ? "" : String(val);
            });
        }

        function update() {
            renderRepeats();
            updateBinds();
            // Ensure new elements are observed for reveal animations
            if (typeof revealObserver !== 'undefined') {
                root.querySelectorAll("[data-reveal]").forEach(el => revealObserver.observe(el));
            }
        }

        // initial render
        update();
        return { state, update };
    }

    // Reveal animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;

                // Handle delay
                const delay = el.getAttribute("data-delay");
                if (delay) {
                    el.style.transitionDelay = `${delay}ms`;
                }

                el.classList.add("revealed");

                // Check for counters on self or children
                if (el.hasAttribute("data-count")) {
                    animateCounter(el);
                }
                el.querySelectorAll("[data-count]").forEach(c => animateCounter(c));

                revealObserver.unobserve(el);
            }
        });
    }, observerOptions);

    // Initial observe
    document.querySelectorAll("[data-reveal]").forEach(el => revealObserver.observe(el));

    // Number Counter Animation
    function animateCounter(el) {
        const target = parseInt(el.getAttribute("data-target") || "0", 10);
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function step(currentTime) {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            const value = Math.floor(ease * (target - start) + start);
            el.textContent = value + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    // Parallax Effect
    document.addEventListener("scroll", () => {
        const scrolled = window.scrollY;

        // Background heavy blur movement
        document.querySelectorAll(".glow-blur").forEach((el, index) => {
            const speed = index % 2 === 0 ? 0.05 : -0.05;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, { passive: true });

    // 3D Tilt Effect for Hero Card
    const card = document.querySelector(".preview-card");
    if (card) {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // max 5deg
            const rotateY = ((x - centerX) / centerX) * 5; // max 5deg

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transition = "transform 0.5s ease";
            card.style.transform = "perspective(1000px) rotateY(-5deg) rotateX(5deg)";
            setTimeout(() => {
                card.style.transition = "";
            }, 500);
        });
    }

    // Swiper Carousel (Zero ao Sucesso)
    const swiperProcesso = new Swiper('.swiper-processo', {
        slidesPerView: 1.2,
        spaceBetween: 14,
        centeredSlides: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            480: {
                slidesPerView: 2.2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 24,
            },
            1024: {
                slidesPerView: 4,
                allowTouchMove: false,
                spaceBetween: 24,
            },
        }
    });

    // Sticky header
    const header = document.querySelector("[data-sticky]");
    function onScroll() {
        if (!header) return;
        if (window.scrollY > 6) header.classList.add("header--scrolled");
        else header.classList.remove("header--scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Smooth anchors (native scroll-behavior handles most modern browsers)
    document.addEventListener("click", (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute("href");
        const el = document.querySelector(id);
        if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", id);
            el.focus({ preventScroll: true });
        }
    });

    // Footer year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // WhatsApp link
    const waLink = document.getElementById("whatsapp-link");
    if (waLink && WHATSAPP_NUMBER) {
        const text = encodeURIComponent(
            "Olá! Gostaria de falar sobre um projeto com a Cresça Soluções."
        );
        waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    } else if (waLink) {
        waLink.href = "#contato";
    }

    // Reactive sections
    // KPIs handled by HTML data-count

    const depoRoot = document.querySelector(".testimonials-grid").parentElement;
    if (depoRoot && depoRoot.hasAttribute("data-markup")) {
        const demoItems = [
            {
                texto: "A Cresça Soluções entregou nosso MVP em tempo recorde. A qualidade do código e a proatividade da equipe foram fundamentais para nossa rodada de investimento.",
                autor: "Fúlvio",
                empresa: "CEO @ EletroReparos",
                letra: "F"
            },
            {
                texto: "Precisávamos de um sistema interno para nossa logistica e a Cresça nos surpreendeu. O projeto foi entregue antes do prazo e com uma usabilidade incrível.",
                autor: "Fernanda",
                empresa: "CEO @ OxenteRegrigerações",
                letra: "F"
            },

        ];

        createMarkup(depoRoot, {
            depoimentos: demoItems,
        });
    }

    const faqRoot = document.querySelector("#faq .faq[data-markup]");
    if (faqRoot) {
        createMarkup(faqRoot, {
            faq: [
                {
                    q: "Vocês trabalham com metodologias ágeis?",
                    a: "Sim, trabalhamos com Sprints semanais. Você terá acesso a um dashboard para acompanhar o progresso em tempo real e participar de validações constantes.",
                },
                {
                    q: "Qual o custo médio de um projeto?",
                    a: "Cada projeto é único. Nossos orçamentos são baseados na complexidade e valor entregue. Oferecemos um diagnóstico gratuito para entender sua necessidade e propor o melhor custo-benefício.",
                },
                {
                    q: "Vocês dão suporte após o lançamento?",
                    a: "Com certeza. Todos os projetos incluem um período de garantia e oferecemos planos de manutenção e evolução contínua para que sua tecnologia nunca fique obsoleta.",
                },
                {
                    q: "A propriedade intelectual do código é minha?",
                    a: "Sim. Ao final do projeto e quitação, todos os direitos de propriedade intelectual e código-fonte são transferidos integralmente para você/sua empresa.",
                },
            ],
        });
    }

    // Form handling
    const form = document.getElementById("lead-form");
    const formMsg = document.getElementById("form-msg");
    function setMsg(text, ok) {
        if (!formMsg) return;
        formMsg.textContent = text;
        formMsg.style.color = ok ? "#86efac" : "#fca5a5";
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            setMsg("", true);
            const fd = new FormData(form);
            const nome = (fd.get("nome") || "").toString().trim();
            const email = (fd.get("email") || "").toString().trim();
            const whats = (fd.get("whats") || "").toString().trim();
            const tipo = (fd.get("tipo") || "").toString().trim();
            const mensagem = (fd.get("mensagem") || "").toString().trim();

            if (!nome || !email || !tipo) {
                setMsg("Preencha nome, e-mail e tipo de projeto.", false);
                return;
            }

            const payload = { nome, email, whats, tipo, mensagem, origem: location.href, momento: new Date().toISOString() };

            // Abrir WhatsApp com os dados do formulário
            const waText = encodeURIComponent(
                `Olá! Acabei de enviar um formulário no site.\n\n*Nome:* ${nome}\n*E-mail:* ${email}\n*Serviço:* ${tipo}\n*Mensagem:* ${mensagem}`
            );
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

            try {
                if (FORM_ENDPOINT) {
                    const res = await fetch(FORM_ENDPOINT, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });
                    if (!res.ok) throw new Error("Falha ao enviar");
                    setMsg("Recebemos seus dados! Redirecionando para o WhatsApp...", true);
                    form.reset();
                    setTimeout(() => window.open(waUrl, "_blank"), 1000);
                } else {
                    // Fallback: Abre o e-mail preenchido e depois o WhatsApp
                    const subject = encodeURIComponent("Novo pedido de orçamento — Cresça Soluções");
                    const body = encodeURIComponent(
                        `Nome: ${nome}\nE-mail: ${email}\nWhatsApp: ${whats}\nTipo: ${tipo}\nMensagem: ${mensagem}\n\nEnviado via crescaweb.com`
                    );

                    setMsg("Abrindo e-mail e WhatsApp...", true);
                    form.reset();

                    // Abre o WhatsApp em nova aba
                    window.open(waUrl, "_blank");
                    // Dispara o mailto na aba atual
                    window.location.href = `mailto:contato@crescaweb.com?subject=${subject}&body=${body}`;
                }
            } catch (err) {
                console.error(err);
                setMsg("Não conseguimos enviar agora. Tente novamente em instantes.", false);
            }
        });
    }
    // Theme Handling (System Default + Toggle)
    function initTheme() {
        const toggleBtn = document.getElementById("theme-toggle");
        const sunIcon = document.querySelector(".icon-sun");
        const moonIcon = document.querySelector(".icon-moon");

        if (!toggleBtn) return;

        // Check functionality: 
        // 1. LocalStorage
        // 2. System Preference
        // Default is dark (since original site was dark), but we want to respect system if light

        function getPreferredTheme() {
            const stored = localStorage.getItem("theme");
            if (stored) return stored;

            return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        }

        function setTheme(theme) {
            const root = document.documentElement;
            if (theme === "light") {
                root.classList.add("light-theme");
                // In Light mode, show Moon (to switch to Dark)
                sunIcon.style.display = "none";
                moonIcon.style.display = "block";
            } else {
                root.classList.remove("light-theme");
                // In Dark mode, show Sun (to switch to Light)
                sunIcon.style.display = "block";
                moonIcon.style.display = "none";
            }
            // Save preference
            localStorage.setItem("theme", theme);
        }

        // Initialize
        setTheme(getPreferredTheme());

        // Toggle Event
        toggleBtn.addEventListener("click", () => {
            const current = document.documentElement.classList.contains("light-theme") ? "light" : "dark";
            const newTheme = current === "light" ? "dark" : "light";
            setTheme(newTheme);
        });

        // Listen for system changes if no override is set (optional, but good UX to stick to user choice if they made one)
        // Here we just listen for changes and update if user hasn't explicitly set a preference in this session? 
        // Standard behavior: explicit toggle overrides system forever until cleared. 
        // We stick to the getPreferredTheme logic which prioritizes localStorage.
    }

    initTheme();
})();
