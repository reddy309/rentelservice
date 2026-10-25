document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     1. COMMON HELPERS
  ========================================================= */

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons({
        attrs: {
          "stroke-width": 1.7,
        },
      });
    }
  }

  function getCurrentPage() {
    return (
      window.location.pathname.split("/").pop().toLowerCase() || "index.html"
    );
  }

  function normalizePagePath(href) {
    if (!href) return "";

    try {
      const url = new URL(href, window.location.href);

      return url.pathname.split("/").pop().toLowerCase() || "index.html";
    } catch (error) {
      return href.split("#")[0].split("?")[0].split("/").pop().toLowerCase();
    }
  }

  function observeReveal(elements, visibleClass = "is-visible", options = {}) {
    if (!elements.length) return;

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
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
        ...options,
      },
    );

    elements.forEach((element, index) => {
      if (options.stagger) {
        element.style.transitionDelay = `${(index % 4) * 100}ms`;
      }

      observer.observe(element);
    });
  }

  refreshIcons();

  /* =========================================================
     2. HEADER ELEMENTS
  ========================================================= */

  const header =
    document.getElementById("siteHeader") ||
    document.querySelector(".site-header");

  const menuToggle =
    document.getElementById("menuToggle") ||
    document.querySelector(".menu-toggle") ||
    document.querySelector(".mobile-menu-toggle");

  const mainNav =
    document.getElementById("mainNav") ||
    document.querySelector(".main-nav") ||
    document.querySelector(".nav-links") ||
    document.querySelector(".site-nav");

  const homeButton = document.getElementById("homeDropdownButton");

  const homeDropdown = homeButton ? homeButton.closest(".nav-dropdown") : null;

  const homePages = ["index.html", "index1.html"];

  /* =========================================================
     3. HOME 1 / HOME 2 ACTIVE UNDERLINE
     This is the main fix.
  ========================================================= */

  function setActiveHomeLine() {
    if (!homeButton) return;

    const currentPage = getCurrentPage();
    const isHomePage = homePages.includes(currentPage);

    // Keep Home active on BOTH index.html and index1.html.
    homeButton.classList.toggle("active", isHomePage);
    homeButton.classList.toggle("home-page-active", isHomePage);

    if (isHomePage) {
      homeButton.setAttribute("aria-current", "page");
    } else {
      homeButton.removeAttribute("aria-current");
    }

    // Also activate a wrapping navigation link, if present.
    const homeWrapper = homeButton.closest(".nav-link:not(button), a.nav-link");

    if (homeWrapper) {
      homeWrapper.classList.toggle("active", isHomePage);
    }

    // Highlight the correct Home dropdown item.
    if (homeDropdown) {
      homeDropdown
        .querySelectorAll(".dropdown-menu a, .dropdown-menu .dropdown-link")
        .forEach((link) => {
          const linkPage = normalizePagePath(link.getAttribute("href"));

          const isCurrentPage =
            homePages.includes(linkPage) && linkPage === currentPage;

          link.classList.toggle("active", isCurrentPage);

          if (isCurrentPage) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
    }
  }

  setActiveHomeLine();

  /* =========================================================
     4. HOME DROPDOWN OPEN / CLOSE
  ========================================================= */

  function closeDropdown() {
    if (homeDropdown) {
      homeDropdown.classList.remove("active", "open");
    }

    if (homeButton) {
      homeButton.setAttribute("aria-expanded", "false");
    }

    // Closing the dropdown must not remove Home underline.
    setActiveHomeLine();
  }

  function toggleDropdown() {
    if (!homeDropdown) return;

    const isOpen =
      homeDropdown.classList.contains("active") ||
      homeDropdown.classList.contains("open");

    homeDropdown.classList.toggle("active", !isOpen);
    homeDropdown.classList.toggle("open", !isOpen);

    if (homeButton) {
      homeButton.setAttribute("aria-expanded", String(!isOpen));
    }

    refreshIcons();
  }

  if (homeButton && homeDropdown) {
    homeButton.setAttribute("aria-haspopup", "true");
    homeButton.setAttribute("aria-expanded", "false");

    homeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleDropdown();
    });

    homeDropdown
      .querySelectorAll(".dropdown-menu a, .dropdown-menu .dropdown-link")
      .forEach((link) => {
        link.addEventListener("click", () => {
          closeDropdown();

          if (window.innerWidth <= 820) {
            closeMobileMenu();
          }
        });
      });
  }

  /* =========================================================
     5. OTHER NAVIGATION ACTIVE STATES
  ========================================================= */

  function setActiveNavigation() {
    if (!mainNav) {
      setActiveHomeLine();
      return;
    }

    const currentPage = getCurrentPage();

    mainNav.querySelectorAll("a").forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || href.startsWith("#")) return;

      const linkPage = normalizePagePath(href);

      // Do not let Home 1/Home 2 links override Home button state.
      if (homePages.includes(linkPage)) return;

      const isActive = linkPage === currentPage;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    setActiveHomeLine();
  }

  setActiveNavigation();

  /* =========================================================
     6. MOBILE MENU ICON
  ========================================================= */

  function setMenuIcon(isOpen = false) {
    if (!menuToggle) return;

    menuToggle.innerHTML = isOpen
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';

    menuToggle.setAttribute("aria-label", isOpen ? "Close Menu" : "Open Menu");

    menuToggle.setAttribute("title", isOpen ? "Close Menu" : "Menu");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    refreshIcons();
  }

  /* =========================================================
     7. MOBILE MENU OPEN / CLOSE
  ========================================================= */

  function closeMobileMenu() {
    if (mainNav) {
      mainNav.classList.remove("active", "open");
    }

    document.body.classList.remove("menu-open");

    if (menuToggle) {
      menuToggle.classList.remove("active");
      setMenuIcon(false);
    }

    setActiveHomeLine();
  }

  function openMobileMenu() {
    if (!mainNav) return;

    mainNav.classList.add("active");
    document.body.classList.add("menu-open");

    if (menuToggle) {
      menuToggle.classList.add("active");
      setMenuIcon(true);
    }
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = mainNav.classList.contains("active");

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 820) {
          closeMobileMenu();
        }
      });
    });

    const mobileLogin = mainNav.querySelector(".mobile-login");

    if (mobileLogin) {
      mobileLogin.addEventListener("click", () => {
        if (window.innerWidth <= 820) {
          closeMobileMenu();
        }
      });
    }
  }

  /* =========================================================
     8. OUTSIDE CLICK + ESCAPE KEY
  ========================================================= */

  document.addEventListener("click", (event) => {
    if (homeDropdown && !homeDropdown.contains(event.target)) {
      closeDropdown();
    }

    if (!mainNav || !menuToggle) return;

    if (window.innerWidth <= 820) {
      const menuIsOpen = mainNav.classList.contains("active");

      const clickedInsideMenu = mainNav.contains(event.target);

      const clickedToggle = menuToggle.contains(event.target);

      if (menuIsOpen && !clickedInsideMenu && !clickedToggle) {
        closeMobileMenu();
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeDropdown();
    closeMobileMenu();
  });

  /* =========================================================
     9. STICKY HEADER
  ========================================================= */

  function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 20);
  }

  updateHeader();

  let scrollScheduled = false;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollScheduled) return;

      scrollScheduled = true;

      window.requestAnimationFrame(() => {
        updateHeader();
        scrollScheduled = false;
      });
    },
    { passive: true },
  );

  /* =========================================================
     10. RESPONSIVE RESET
     Mobile / Tablet: <= 820px
  ========================================================= */

  let previousWidth = window.innerWidth;

  window.addEventListener("resize", () => {
    const currentWidth = window.innerWidth;

    const crossedBreakpoint =
      (currentWidth <= 820 && previousWidth > 820) ||
      (currentWidth > 820 && previousWidth <= 820);

    if (crossedBreakpoint) {
      closeMobileMenu();
      closeDropdown();
    }

    previousWidth = currentWidth;
  });

  /* =========================================================
     11. GENERAL SCROLL REVEAL
  ========================================================= */

  observeReveal(
    document.querySelectorAll(".reveal-left, .reveal-right"),
    "is-visible",
    {
      threshold: 0.15,
      rootMargin: "0px 0px -35px 0px",
    },
  );

  observeReveal(document.querySelectorAll(".reveal"), "visible", {
    threshold: 0.12,
    rootMargin: "0px 0px -35px 0px",
    stagger: true,
  });

  observeReveal(
    document.querySelectorAll(".ownership-journey .reveal"),
    "visible",
    {
      threshold: 0.15,
    },
  );

  observeReveal(
    document.querySelectorAll(".property-care .reveal"),
    "visible",
    {
      threshold: 0.12,
      rootMargin: "0px 0px -25px 0px",
      stagger: true,
    },
  );

  observeReveal(document.querySelectorAll(".property-cta .reveal"), "visible", {
    threshold: 0.15,
    rootMargin: "0px 0px -30px 0px",
  });

  /* =========================================================
     12. SIGNATURE RENTAL COLLECTION
  ========================================================= */

  const signatureSection = document.querySelector(".signature-section");

  if (signatureSection) {
    observeReveal(signatureSection.querySelectorAll(".reveal"), "is-visible", {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px",
    });

    signatureSection
      .querySelectorAll(".signature-favorite")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const isFavorite = button.classList.toggle("is-favorite");

          button.setAttribute("aria-pressed", String(isFavorite));

          const card = button.closest(".signature-card");

          const propertyName =
            card?.querySelector("h3")?.textContent.trim() || "property";

          button.setAttribute(
            "aria-label",
            isFavorite
              ? `Remove ${propertyName} from favorites`
              : `Add ${propertyName} to favorites`,
          );

          button.innerHTML = isFavorite
            ? '<i data-lucide="heart" fill="currentColor"></i>'
            : '<i data-lucide="heart"></i>';

          refreshIcons();
        });
      });

    signatureSection.querySelectorAll(".signature-image img").forEach((img) => {
      function handleImageError() {
        img.alt = "Property image unavailable";

        img.closest(".signature-image")?.classList.add("image-unavailable");
      }

      img.addEventListener("error", handleImageError);

      if (img.complete && img.naturalWidth === 0) {
        handleImageError();
      }
    });

    signatureSection.querySelectorAll(".signature-link").forEach((link) => {
      const propertyName = link
        .closest(".signature-card")
        ?.querySelector("h3")
        ?.textContent.trim();

      if (propertyName) {
        link.setAttribute("aria-label", `Enquire about ${propertyName}`);
      }
    });

    const viewAllLink = signatureSection.querySelector(".signature-view-all");

    if (viewAllLink) {
      viewAllLink.setAttribute(
        "aria-label",
        "Explore all available properties",
      );
    }
  }

  /* =========================================================
     13. ESTATENEST STORY
  ========================================================= */

  observeReveal(document.querySelectorAll(".story-reveal"), "story-visible", {
    threshold: 0.15,
    rootMargin: "0px 0px -35px 0px",
  });

  const storyImages = document.querySelectorAll(".story-image-wrapper img");

  storyImages.forEach((image) => {
    image.addEventListener("error", () => {
      image.style.opacity = "0";
      image.setAttribute("aria-label", "Property image unavailable");
    });
  });

  const storyButton = document.querySelector(".story-button");

  if (storyButton) {
    storyButton.setAttribute("aria-label", "Discover the EstateNest story");
  }

  /* =========================================================
     14. STORY STATISTICS COUNTERS
  ========================================================= */

  const storyCounters = document.querySelectorAll(".story-stats [data-count]");

  function animateSimpleCounter(counter) {
    if (counter.dataset.animated === "true") return;

    counter.dataset.animated = "true";

    const target = Number(counter.dataset.count);

    if (!Number.isFinite(target)) return;

    if (reduceMotion) {
      counter.textContent = target.toLocaleString();
      return;
    }

    const duration = 1600;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      counter.textContent = Math.floor(target * easedProgress).toLocaleString();

      if (progress < 1) {
        window.requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }

    window.requestAnimationFrame(updateCounter);
  }

  const statsSection = document.querySelector(".story-stats");

  if (statsSection && "IntersectionObserver" in window && !reduceMotion) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            storyCounters.forEach(animateSimpleCounter);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 },
    );

    statsObserver.observe(statsSection);
  } else {
    storyCounters.forEach(animateSimpleCounter);
  }

  /* =========================================================
     15. BESPOKE SERVICES
  ========================================================= */

  observeReveal(document.querySelectorAll(".service-reveal"), "is-visible", {
    threshold: 0.12,
    rootMargin: "0px 0px -30px 0px",
    stagger: true,
  });

  document.querySelectorAll(".bespoke-image img").forEach((image) => {
    image.addEventListener("error", () => {
      image.style.display = "none";

      const imageContainer = image.closest(".bespoke-image");

      if (!imageContainer) return;

      imageContainer.classList.add("image-unavailable");

      if (!imageContainer.querySelector(".image-fallback-text")) {
        const fallback = document.createElement("span");

        fallback.className = "image-fallback-text";
        fallback.textContent = "Service Image";

        fallback.style.cssText = `
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text);
            font-family: var(--font-body, Montserrat, sans-serif);
            font-size: 12px;
          `;

        imageContainer.appendChild(fallback);
      }
    });
  });

  document.querySelectorAll(".bespoke-link").forEach((link) => {
    const title = link
      .closest(".bespoke-card")
      ?.querySelector("h3")
      ?.textContent.trim();

    if (title) {
      link.setAttribute("aria-label", `Explore ${title}`);
    }
  });

  /* =========================================================
     16. HERO / GENERAL COUNTERS
  ========================================================= */

  const counters = document.querySelectorAll("[data-count], .counter");

  function animateCounter(element) {
    if (element.dataset.countAnimated === "true") return;

    element.dataset.countAnimated = "true";

    const rawTarget =
      element.getAttribute("data-count") ||
      element.getAttribute("data-target") ||
      element.textContent;

    const target = Number(String(rawTarget).replace(/[^\d.]/g, ""));

    if (!Number.isFinite(target)) return;

    if (reduceMotion) {
      element.textContent = target.toLocaleString();
      return;
    }

    const duration = 1600;
    const startTime = performance.now();

    const prefix = element.getAttribute("data-prefix") || "";

    const suffix =
      element.getAttribute("data-suffix") ||
      (element.classList.contains("counter") ? "+" : "");

    function updateCounter(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = target * easedProgress;

      const displayValue = Number.isInteger(target)
        ? Math.floor(currentValue).toLocaleString()
        : currentValue.toFixed(1);

      element.textContent = prefix + displayValue + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(updateCounter);
      } else {
        element.textContent =
          prefix +
          (Number.isInteger(target)
            ? target.toLocaleString()
            : target.toFixed(1)) +
          suffix;
      }
    }

    window.requestAnimationFrame(updateCounter);
  }

  const generalCounters = Array.from(counters).filter(
    (counter) => !counter.closest(".story-stats"),
  );

  if (
    "IntersectionObserver" in window &&
    generalCounters.length &&
    !reduceMotion
  ) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 },
    );

    generalCounters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  } else {
    generalCounters.forEach(animateCounter);
  }

  /* =========================================================
     17. TESTIMONIAL SLIDER
  ========================================================= */

  document
    .querySelectorAll("[data-testimonial-slider], .testimonial-slider")
    .forEach((slider) => {
      const slides = slider.querySelectorAll(
        ".testimonial-card, .testimonial-slide, [data-testimonial]",
      );

      const previousButton = slider.querySelector(
        ".testimonial-prev, [data-testimonial-prev]",
      );

      const nextButton = slider.querySelector(
        ".testimonial-next, [data-testimonial-next]",
      );

      const dots = slider.querySelectorAll(
        ".testimonial-dot, [data-testimonial-dot]",
      );

      if (slides.length < 2) return;

      let currentIndex = 0;

      function showSlide(index) {
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
          const isActive = slideIndex === currentIndex;

          slide.classList.toggle("active", isActive);

          slide.setAttribute("aria-hidden", String(!isActive));
        });

        dots.forEach((dot, dotIndex) => {
          const isActive = dotIndex === currentIndex;

          dot.classList.toggle("active", isActive);

          if (isActive) {
            dot.setAttribute("aria-current", "true");
          } else {
            dot.removeAttribute("aria-current");
          }
        });
      }

      previousButton?.addEventListener("click", () => {
        showSlide(currentIndex - 1);
      });

      nextButton?.addEventListener("click", () => {
        showSlide(currentIndex + 1);
      });

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          showSlide(index);
        });
      });

      showSlide(0);
    });

  /* =========================================================
     18. CTA BUTTON FEEDBACK
  ========================================================= */

  document
    .querySelectorAll(".cta-button, .btn-primary, .btn-secondary")
    .forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.add("is-clicked");

        window.setTimeout(() => {
          button.classList.remove("is-clicked");
        }, 180);
      });
    });

  /* =========================================================
     19. SAME-PAGE SMOOTH SCROLL
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
     20. FOOTER CURRENT YEAR
  ========================================================= */

  document
    .querySelectorAll("[data-current-year], #currentYear")
    .forEach((element) => {
      element.textContent = new Date().getFullYear();
    });

  /* =========================================================
     21. FORM VALIDATION
  ========================================================= */

  document.querySelectorAll("form[data-validate]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
      }
    });
  });

  /* =========================================================
     22. FINAL INITIALIZATION
  ========================================================= */

  function initializeHeader() {
    setActiveHomeLine();
    setActiveNavigation();
    updateHeader();

    if (menuToggle) {
      setMenuIcon(false);
    }
  }

  initializeHeader();
});
