/* =========================================================
   ESTATENEST ABOUT PAGE — TOTAL UPDATED JAVASCRIPT

   1. Header and Navigation
   2. Home 1 / Home 2 Active Underline
   3. About Page Active Underline
   4. Home Dropdown
   5. Mobile Menu
   6. Sticky Header
   7. Our Story Reveal
   8. Core Values Reveal
   9. Mission & Vision Reveal
   10. Meet Our Team Reveal
   11. Management Philosophy Reveal
   12. Achievements Reveal + Counters
   13. Contact CTA Reveal
   14. Lucide Icons
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     1. COMMON HELPERS
  ========================================================= */

  const refreshIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  };

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const currentPage =
    window.location.pathname.split("/").pop().toLowerCase() || "index.html";

  const homePages = ["index.html", "index1.html"];

  // Change these filenames if your About page uses another name.
  const aboutPages = [
    "about.html",
    "about-us.html",
    "aboutus.html",
    "about-page.html",
  ];

  const normalizePage = (href) => {
    if (!href) return "";

    try {
      return (
        new URL(href, window.location.href).pathname
          .split("/")
          .pop()
          .toLowerCase() || "index.html"
      );
    } catch (error) {
      return href.split("?")[0].split("#")[0].split("/").pop().toLowerCase();
    }
  };

  refreshIcons();

  /* =========================================================
     2. HEADER ELEMENTS
  ========================================================= */

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const homeButton = document.getElementById("homeDropdownButton");
  const dropdown = homeButton
    ? homeButton.closest(".nav-dropdown")
    : document.querySelector(".nav-dropdown");

  const header = document.getElementById("siteHeader");

  /* =========================================================
     3. ACTIVE NAVIGATION
     HOME 1 + HOME 2 + ABOUT PAGE
  ========================================================= */

  function updateActiveNavigation() {
    const isHomePage = homePages.includes(currentPage);
    const isAboutPage = aboutPages.includes(currentPage);

    // Keep Home dropdown button active on both home pages.
    if (homeButton) {
      homeButton.classList.toggle("active", isHomePage);
      homeButton.classList.toggle("home-page-active", isHomePage);

      if (isHomePage) {
        homeButton.setAttribute("aria-current", "page");
      } else {
        homeButton.removeAttribute("aria-current");
      }
    }

    if (!mainNav) return;

    mainNav.querySelectorAll("a.nav-link").forEach((link) => {
      const href = link.getAttribute("href");

      if (!href) return;

      const linkPage = normalizePage(href);

      // Do not treat Home dropdown links as regular nav links.
      if (link.closest(".nav-dropdown") && homePages.includes(linkPage)) {
        return;
      }

      // About link remains active on the About page.
      const isAboutLink = aboutPages.includes(linkPage);

      if (isAboutLink) {
        link.classList.toggle("active", isAboutPage);

        if (isAboutPage) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }

        return;
      }

      // Other navigation links.
      const isActive =
        linkPage === currentPage && !homePages.includes(linkPage);

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    // Highlight the selected Home submenu item.
    if (dropdown) {
      dropdown.querySelectorAll(".dropdown-menu a").forEach((link) => {
        const linkPage = normalizePage(link.getAttribute("href"));

        const isCurrentHomePage =
          homePages.includes(linkPage) && linkPage === currentPage;

        link.classList.toggle("active", isCurrentHomePage);

        if (isCurrentHomePage) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }
  }

  updateActiveNavigation();

  /* =========================================================
     4. MENU ICON
  ========================================================= */

  function setMenuIcon(open = false) {
    if (!menuToggle) return;

    menuToggle.innerHTML = open
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';

    menuToggle.setAttribute("aria-label", open ? "Close Menu" : "Open Menu");

    menuToggle.setAttribute("title", open ? "Close Menu" : "Menu");

    menuToggle.setAttribute("aria-expanded", String(open));

    refreshIcons();
  }

  /* =========================================================
     5. CLOSE HOME DROPDOWN
  ========================================================= */

  function closeDropdown() {
    if (dropdown) {
      dropdown.classList.remove("active");
    }

    if (homeButton) {
      homeButton.setAttribute("aria-expanded", "false");
    }

    // Closing dropdown must not remove the active underline.
    updateActiveNavigation();
  }

  /* =========================================================
     6. TOGGLE HOME DROPDOWN
  ========================================================= */

  function toggleDropdown() {
    if (!dropdown) return;

    const isOpen = dropdown.classList.contains("active");

    dropdown.classList.toggle("active", !isOpen);

    if (homeButton) {
      homeButton.setAttribute("aria-expanded", String(!isOpen));
    }

    refreshIcons();
  }

  if (homeButton && dropdown) {
    homeButton.setAttribute("aria-haspopup", "true");
    homeButton.setAttribute("aria-expanded", "false");

    homeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      toggleDropdown();
    });

    dropdown.querySelectorAll(".dropdown-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 820) {
          closeMenu();
        } else {
          closeDropdown();
        }
      });
    });
  }

  /* =========================================================
     7. MOBILE MENU
  ========================================================= */

  function closeMenu() {
    if (mainNav) {
      mainNav.classList.remove("active");
    }

    document.body.classList.remove("menu-open");

    if (menuToggle) {
      menuToggle.classList.remove("active");
    }

    closeDropdown();
    setMenuIcon(false);
  }

  function openMenu() {
    if (!mainNav) return;

    mainNav.classList.add("active");
    document.body.classList.add("menu-open");

    if (menuToggle) {
      menuToggle.classList.add("active");
    }

    setMenuIcon(true);
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = mainNav && mainNav.classList.contains("active");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (mainNav) {
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 820) {
          closeMenu();
        }
      });
    });
  }

  /* =========================================================
     8. OUTSIDE CLICK
  ========================================================= */

  document.addEventListener("click", (event) => {
    if (dropdown && !dropdown.contains(event.target)) {
      closeDropdown();
    }

    if (
      window.innerWidth <= 820 &&
      mainNav &&
      menuToggle &&
      mainNav.classList.contains("active")
    ) {
      const insideNav = mainNav.contains(event.target);
      const insideToggle = menuToggle.contains(event.target);

      if (!insideNav && !insideToggle) {
        closeMenu();
      }
    }
  });

  /* =========================================================
     9. ESCAPE KEY
  ========================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* =========================================================
     10. STICKY HEADER
  ========================================================= */

  function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 20);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  /* =========================================================
     11. RESPONSIVE RESET
  ========================================================= */

  let previousWidth = window.innerWidth;

  window.addEventListener("resize", () => {
    const currentWidth = window.innerWidth;

    const crossedBreakpoint =
      (currentWidth <= 820 && previousWidth > 820) ||
      (currentWidth > 820 && previousWidth <= 820);

    if (crossedBreakpoint) {
      closeMenu();
    }

    previousWidth = currentWidth;
  });

  /* =========================================================
     12. SHARED SCROLL REVEAL
  ========================================================= */

  function setupReveal(
    elements,
    visibleClass = "is-visible",
    threshold = 0.12,
    rootMargin = "0px 0px -30px 0px",
    stagger = false,
  ) {
    if (!elements || !elements.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add(visibleClass);
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass);
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      },
    );

    elements.forEach((element, index) => {
      if (stagger) {
        element.style.transitionDelay = `${(index % 4) * 100}ms`;
      }

      observer.observe(element);
    });
  }

  /* =========================================================
     13. OUR STORY
  ========================================================= */

  const storySection = document.querySelector("#ourStory");

  if (storySection) {
    setupReveal(
      storySection.querySelectorAll(".story-reveal"),
      "is-visible",
      0.15,
      "0px 0px -40px 0px",
    );

    storySection.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", () => {
        img.classList.add("image-unavailable");
        img.setAttribute("aria-label", "Story image unavailable");
      });
    });
  }

  /* =========================================================
     14. CORE VALUES
  ========================================================= */

  const coreValues = document.querySelector("#coreValues");

  if (coreValues) {
    setupReveal(
      coreValues.querySelectorAll(".reveal"),
      "is-visible",
      0.12,
      "0px 0px -35px 0px",
      true,
    );
  }

  /* =========================================================
     15. MISSION & VISION
  ========================================================= */

  const missionVision = document.querySelector("#missionVision");

  if (missionVision) {
    setupReveal(
      missionVision.querySelectorAll(".mv-reveal"),
      "is-visible",
      0.1,
      "0px 0px -20px 0px",
    );
  }

  /* =========================================================
     16. MEET OUR TEAM
  ========================================================= */

  const teamSection = document.querySelector("#meetOurTeam");

  if (teamSection) {
    setupReveal(
      teamSection.querySelectorAll(".team-reveal"),
      "is-visible",
      0.12,
      "0px 0px -30px 0px",
      true,
    );

    teamSection.querySelectorAll(".team-image img").forEach((img) => {
      function handleImageError() {
        img.style.display = "none";

        const wrapper = img.closest(".team-image");

        if (wrapper) {
          wrapper.classList.add("team-image-unavailable");
        }
      }

      img.addEventListener("error", handleImageError);

      if (img.complete && img.naturalWidth === 0) {
        handleImageError();
      }
    });
  }

  /* =========================================================
     17. MANAGEMENT PHILOSOPHY
  ========================================================= */

  setupReveal(
    document.querySelectorAll(".philosophy-reveal"),
    "is-visible",
    0.12,
    "0px 0px -30px 0px",
    true,
  );

  /* =========================================================
     18. ACHIEVEMENTS — SCROLL REVEAL
  ========================================================= */

  const achievements = document.querySelector("#achievements");

  if (achievements) {
    setupReveal(
      achievements.querySelectorAll(".reveal"),
      "is-visible",
      0.15,
      "0px 0px -30px 0px",
    );
  }

  /* =========================================================
     19. ACHIEVEMENTS — COUNTERS
  ========================================================= */

  function animateCounter(counter) {
    if (counter.dataset.animated === "true") return;

    const target = Number(counter.dataset.target);

    if (!Number.isFinite(target) || target < 0) return;

    counter.dataset.animated = "true";

    if (reduceMotion) {
      counter.textContent = target.toLocaleString("en-IN");
      return;
    }

    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 4);

      counter.textContent = Math.floor(target * eased).toLocaleString("en-IN");

      if (progress < 1) {
        window.requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString("en-IN");
      }
    }

    window.requestAnimationFrame(updateCounter);
  }

  if (achievements) {
    const counters = achievements.querySelectorAll(".counter[data-target]");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
    } else {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.5,
        },
      );

      counters.forEach((counter) => {
        counterObserver.observe(counter);
      });
    }
  }

  /* =========================================================
     20. CONTACT CTA
  ========================================================= */

  const contactCta = document.querySelector("#contact-cta");

  if (contactCta) {
    setupReveal([contactCta], "is-visible", 0.15, "0px 0px -25px 0px");
  }

  /* =========================================================
     21. SAME-PAGE SMOOTH SCROLL
  ========================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      let target;

      try {
        target = document.querySelector(href);
      } catch (error) {
        return;
      }

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  /* =========================================================
     22. FOOTER YEAR
  ========================================================= */

  document
    .querySelectorAll("#currentYear, [data-current-year]")
    .forEach((element) => {
      element.textContent = new Date().getFullYear();
    });

  /* =========================================================
     23. FINAL INITIALIZATION
  ========================================================= */

  closeMenu();
  updateHeader();
  updateActiveNavigation();
  refreshIcons();
});
