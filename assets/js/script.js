// Menu mobile
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        menuBtn.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
        menuBtn.textContent = isOpen ? "×" : "=";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.setAttribute("aria-label", "Ouvrir le menu");
            menuBtn.textContent = "=";
        });
    });
}

// Navigation active au défilement
const header = document.querySelector(".header");
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-links a[href^='#']");

const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
};

if (sections.length && navItems.length) {
    const setActiveLink = () => {
        let currentId = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 140;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentId = section.id;
            }
        });

        if (!currentId && window.scrollY < 200) {
            currentId = "accueil";
        }

        navItems.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${currentId}`;
            link.classList.toggle("active", isActive);
        });
    };

    const handleScroll = () => {
        updateHeaderState();
        setActiveLink();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("load", handleScroll);
    handleScroll();
} else {
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    window.addEventListener("load", updateHeaderState);
    updateHeaderState();
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Navigation pas à pas des compétences et des projets
document.querySelectorAll("[data-stepper]").forEach((stepper) => {
    const items = Array.from(stepper.querySelectorAll("[data-stepper-item]"));
    const controls = stepper.parentElement.querySelector("[data-stepper-controls]");

    if (items.length < 2 || !controls) return;

    const previousButton = controls.querySelector("[data-stepper-prev]");
    const nextButton = controls.querySelector("[data-stepper-next]");
    const count = controls.querySelector("[data-stepper-count]");
    const progress = controls.querySelector("[data-stepper-progress]");
    let activeIndex = 0;

    const showItem = (nextIndex) => {
        activeIndex = nextIndex;

        items.forEach((item, index) => {
            const isActive = index === activeIndex;
            item.hidden = !isActive;
            item.classList.remove("stepper-enter");

            if (isActive && !prefersReducedMotion) {
                void item.offsetWidth;
                item.classList.add("stepper-enter");
            }
        });

        previousButton.disabled = activeIndex === 0;
        nextButton.disabled = activeIndex === items.length - 1;
        count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
        progress.style.width = `${((activeIndex + 1) / items.length) * 100}%`;
    };

    previousButton.addEventListener("click", () => {
        if (activeIndex > 0) showItem(activeIndex - 1);
    });
    nextButton.addEventListener("click", () => {
        if (activeIndex < items.length - 1) showItem(activeIndex + 1);
    });

    controls.hidden = false;
    showItem(0);
});

// Préparation du message dans l'application de messagerie du visiteur
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    const formStatus = document.getElementById("contact-form-status");

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get("name").toString().trim();
        const email = formData.get("email").toString().trim();
        const message = formData.get("message").toString().trim();
        const subject = `Message depuis le portfolio - ${name}`;
        const body = [
            `Bonjour Andry,`,
            "",
            message,
            "",
            `Nom : ${name}`,
            `E-mail : ${email}`,
        ].join("\n");
        const mailtoUrl = `mailto:${contactForm.dataset.recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoUrl;
        formStatus.textContent = "Ta messagerie s'ouvre pour finaliser l'envoi. Vérifie le message puis clique sur Envoyer.";
    });
}

// Révélation progressive des éléments
const revealTargets = document.querySelectorAll(
    ".section-title, .about-content > *, .about-infos .info-card, .stats-panel, .contact-content"
);

if (revealTargets.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((target, index) => {
        target.classList.add("reveal");
        target.style.transitionDelay = `${Math.min(index % 6, 4) * 60}ms`;
        revealObserver.observe(target);
    });
} else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
}

// Fond astral
const bgCanvas = document.getElementById("bg-canvas");

if (bgCanvas) {
    const ctx = bgCanvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let stars = [];
    let animationId = 0;

    const starColors = [
        "255, 255, 255",
        "196, 181, 253",
        "125, 211, 252",
        "216, 191, 138",
    ];

    const createStars = () => {
        const count = Math.min(180, Math.floor((width * height) / 9000));
        stars = Array.from({ length: count }, () => {
            const radius = Math.random() * 1.8 + 0.4;
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                r: radius,
                baseAlpha: Math.random() * 0.55 + 0.25,
                twinkleSpeed: Math.random() * 0.018 + 0.006,
                twinkleOffset: Math.random() * Math.PI * 2,
                driftX: (Math.random() - 0.5) * 0.08,
                driftY: (Math.random() - 0.5) * 0.08,
                glow: radius > 1.4 ? Math.random() * 8 + 6 : 0,
                color: starColors[Math.floor(Math.random() * starColors.length)],
            };
        });
    };

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        bgCanvas.width = Math.floor(width * dpr);
        bgCanvas.height = Math.floor(height * dpr);
        bgCanvas.style.width = `${width}px`;
        bgCanvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        createStars();
        draw(0);
    };

    const draw = (time) => {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < stars.length; i += 1) {
            const star = stars[i];

            if (!reduceMotion) {
                star.x += star.driftX;
                star.y += star.driftY;
                if (star.x < -10) star.x = width + 10;
                if (star.x > width + 10) star.x = -10;
                if (star.y < -10) star.y = height + 10;
                if (star.y > height + 10) star.y = -10;
            }

            const twinkle = reduceMotion
                ? 0
                : (Math.sin(time * star.twinkleSpeed + star.twinkleOffset) + 1) / 2;
            const alpha = Math.min(1, star.baseAlpha + twinkle * 0.35);

            if (star.glow) {
                ctx.beginPath();
                ctx.fillStyle = `rgba(${star.color}, ${alpha * 0.12})`;
                ctx.arc(star.x, star.y, star.glow, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.beginPath();
            ctx.fillStyle = `rgba(${star.color}, ${alpha})`;
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fill();
        }

        if (!reduceMotion) {
            animationId = window.requestAnimationFrame(draw);
        }
    };

    window.addEventListener("resize", () => {
        window.cancelAnimationFrame(animationId);
        resize();
        if (!reduceMotion) {
            animationId = window.requestAnimationFrame(draw);
        }
    });

    resize();
    if (!reduceMotion) {
        animationId = window.requestAnimationFrame(draw);
    }
}