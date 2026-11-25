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

// Révélation progressive des éléments
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = document.querySelectorAll(
    ".section-title, .about-content > *, .about-infos .info-card, .skill-card, .project-card, .contact-content"
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