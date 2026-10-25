/* =========================================================
   ESTATENEST - COMPLETE PRICING PAGE JAVASCRIPT
   Header + Active Navigation + Pricing Sections
   Scroll Reveal + Lucide Icons + FAQ Accordion
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     1. LUCIDE ICONS
  ========================================================= */

  const refreshIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  };

  /* =========================================================
     2. HEADER ELEMENTS
  ========================================================= */

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const homeButton = document.getElementById("homeDropdownButton");
  const dropdown = document.querySelector(".nav-dropdown");
  const header = document.getElementById("siteHeader");

  /* =========================================================
     3. PAGE GROUPS
     Add your actual HTML filenames if needed.
  ========================================================= */

  const pageGroups = {
    home: ["index.html", "index1.html", "home.html", "home2.html"],

    about: ["about.html", "about-us.html", "aboutus.html", "about-page.html"],

    services: [
      "services.html",
      "service.html",
      "services-page.html",
      "service-details.html",
      "services-details.html",
      "property-management.html",
      "tenant-screening.html",
      "rent-collection.html",
      "property-maintenance.html",
      "lease-management.html",
      "financial-reporting.html",
    ],

    properties: [
      "properties.html",
      "property.html",
      "properties-page.html",
      "apartments.html",
      "independent-houses.html",
      "villas.html",
      "commercial-properties.html",
    ],

    pricing: [
      "pricing.html",
      "pricing-page.html",
      "management-plans.html",
      "plan-comparison.html",
    ],

    contact: ["contact.html", "contact-us.html", "contact-page.html"],

    dashboard: ["dashboard.html", "owner-dashboard.html"],
  };

  const currentPage = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const getCurrentGroup = () => {
    for (const [group, pages] of Object.entries(pageGroups)) {
      if (pages.includes(currentPage)) {
        return group;
      }
    }

    return "";
  };

  /* =========================================================
     4. ACTIVE NAVIGATION UNDERLINE
     Pricing-related pages keep Pricing active.
  ========================================================= */

  const updateActiveNavigation = () => {
    if (!mainNav) return;

    const activeGroup = getCurrentGroup();
    const allLinks = mainNav.querySelectorAll("a");

    allLinks.forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    });

    if (homeButton) {
      homeButton.classList.remove("active");
      homeButton.removeAttribute("aria-current");
    }

    allLinks.forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
        return;
      }

      let linkPage = "";

      try {
        linkPage = new URL(href, window.location.href).pathname
          .split("/")
          .pop()
          .toLowerCase();
      } catch (error) {
        return;
      }

      // Home dropdown links
      if (pageGroups.home.includes(linkPage)) {
        if (activeGroup === "home") {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }

        return;
      }

      // Exact current-page match
      if (linkPage === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
        return;
      }

      // Match related pages to their navigation group.
      const matchedGroup = Object.entries(pageGroups).find(([group, pages]) =>
        pages.includes(linkPage),
      );

      if (matchedGroup && matchedGroup[0] === activeGroup) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    // Home dropdown button active state
    if (homeButton && activeGroup === "home") {
      homeButton.classList.add("active");
      homeButton.setAttribute("aria-current", "page");
    }

    // Explicitly keep Pricing main navigation active.
    if (activeGroup === "pricing") {
      const pricingLink = Array.from(allLinks).find((link) => {
        const href = link.getAttribute("href");

        if (!href || href.startsWith("#")) return false;

        try {
          const linkPage = new URL(href, window.location.href).pathname
            .split("/")
            .pop()
            .toLowerCase();

          return ["pricing.html", "pricing-page.html"].includes(linkPage);
        } catch (error) {
          return false;
        }
      });

      if (pricingLink) {
        pricingLink.classList.add("active");
        pricingLink.setAttribute("aria-current", "page");
      }
    }
  };

  /* =========================================================
     5. MOBILE MENU ICON
  ========================================================= */

  const setMenuIcon = (isOpen = false) => {
    if (!menuToggle) return;

    menuToggle.innerHTML = isOpen
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';

    menuToggle.setAttribute("aria-label", isOpen ? "Close Menu" : "Open Menu");

    menuToggle.setAttribute("title", isOpen ? "Close Menu" : "Menu");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    refreshIcons();
  };

  /* =========================================================
     6. HOME DROPDOWN
  ========================================================= */

  const closeDropdown = () => {
    if (dropdown) {
      dropdown.classList.remove("active");
    }

    if (homeButton) {
      homeButton.setAttribute("aria-expanded", "false");
    }

    updateActiveNavigation();
  };

  const toggleDropdown = () => {
    if (!dropdown) return;

    const isOpen = dropdown.classList.contains("active");

    dropdown.classList.toggle("active", !isOpen);

    if (homeButton) {
      homeButton.setAttribute("aria-expanded", String(!isOpen));
    }

    refreshIcons();
  };

  /* =========================================================
     7. MOBILE MENU OPEN / CLOSE
  ========================================================= */

  const closeMenu = () => {
    if (mainNav) {
      mainNav.classList.remove("active");
    }

    if (dropdown) {
      dropdown.classList.remove("active");
    }

    if (homeButton) {
      homeButton.setAttribute("aria-expanded", "false");
    }

    setMenuIcon(false);
    updateActiveNavigation();
  };

  const openMenu = () => {
    if (!mainNav) return;

    mainNav.classList.add("active");
    setMenuIcon(true);
  };

  const toggleMenu = () => {
    if (!mainNav) return;

    if (mainNav.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    });
  }

  if (homeButton && dropdown) {
    homeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleDropdown();
    });
  }

  /* =========================================================
     8. NAVIGATION LINK CLICKS
  ========================================================= */

  if (mainNav) {
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 820) {
          closeMenu();
        } else if (dropdown && dropdown.contains(link)) {
          closeDropdown();
        }
      });
    });
  }

  /* =========================================================
     9. OUTSIDE CLICK
  ========================================================= */

  document.addEventListener("click", (event) => {
    if (!mainNav || !menuToggle) return;

    if (window.innerWidth > 820) {
      if (dropdown && !dropdown.contains(event.target)) {
        closeDropdown();
      }

      return;
    }

    if (!mainNav.classList.contains("active")) return;

    const clickedInsideMenu = mainNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  /* =========================================================
     10. ESCAPE KEY
  ========================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* =========================================================
     11. HEADER SCROLL EFFECT
  ========================================================= */

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 20);
  };

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  /* =========================================================
     12. RESPONSIVE MENU RESET
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
     13. SHARED SCROLL REVEAL
  ========================================================= */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const revealObserver =
    "IntersectionObserver" in window && !prefersReducedMotion
      ? new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.12,
            rootMargin: "0px 0px -25px 0px",
          },
        )
      : null;

  const revealItems = document.querySelectorAll(
    ".pricing-reveal, " +
      ".plan-reveal, " +
      ".plan-comparison-section .comparison-reveal, " +
      ".included-services-section .service-reveal, " +
      ".pricing-faq-section .faq-reveal, " +
      ".pricing-cta-section .reveal",
  );

  revealItems.forEach((element) => {
    if (revealObserver) {
      revealObserver.observe(element);
    } else {
      element.classList.add("is-visible");
      element.classList.add("visible");
    }
  });

  /* =========================================================
     14. PRICING FAQ ACCORDION
  ========================================================= */

  const faqSection = document.querySelector(".pricing-faq-section");

  if (faqSection) {
    const faqItems = faqSection.querySelectorAll(".pricing-faq-item");

    faqItems.forEach((item) => {
      const question = item.querySelector(".pricing-faq-question");

      const answer = item.querySelector(".pricing-faq-answer");

      if (!question || !answer) return;

      // Set initial accessibility state.
      const initiallyOpen =
        question.getAttribute("aria-expanded") === "true" ||
        item.classList.contains("is-open");

      question.setAttribute("aria-expanded", String(initiallyOpen));

      answer.hidden = !initiallyOpen;
      item.classList.toggle("is-open", initiallyOpen);

      question.addEventListener("click", () => {
        const wasOpen = question.getAttribute("aria-expanded") === "true";

        // Close all FAQ items.
        faqItems.forEach((otherItem) => {
          const otherQuestion = otherItem.querySelector(
            ".pricing-faq-question",
          );

          const otherAnswer = otherItem.querySelector(".pricing-faq-answer");

          if (!otherQuestion || !otherAnswer) return;

          otherQuestion.setAttribute("aria-expanded", "false");
          otherAnswer.hidden = true;
          otherItem.classList.remove("is-open");
        });

        // Open the selected FAQ item.
        if (!wasOpen) {
          question.setAttribute("aria-expanded", "true");
          answer.hidden = false;
          item.classList.add("is-open");
        }

        refreshIcons();
      });
    });
  }

  /* =========================================================
     15. INITIALIZE PAGE
  ========================================================= */

  updateActiveNavigation();
  closeMenu();
  updateHeader();
  refreshIcons();
});
