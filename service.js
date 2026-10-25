document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     LUCIDE ICONS
  ========================================================= */

  const refreshIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  };

  /* =========================================================
     HEADER ELEMENTS
  ========================================================= */

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const homeButton = document.getElementById("homeDropdownButton");
  const dropdown = document.querySelector(".nav-dropdown");
  const header = document.getElementById("siteHeader");

  /* =========================================================
     CURRENT PAGE
     Change filenames here if your files use different names.
  ========================================================= */

  const currentPage = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const pageGroups = {
    home: ["index.html", "index1.html", "home.html", "home2.html"],
    about: ["about.html", "about-us.html", "aboutus.html", "about-page.html"],
    services: [
      "services.html",
      "service.html",
      "services-page.html",
      "property-management.html",
    ],
    properties: ["properties.html", "property.html", "properties-page.html"],
    pricing: ["pricing.html", "pricing-page.html"],
    contact: ["contact.html", "contact-us.html", "contact-page.html"],
    dashboard: ["dashboard.html", "owner-dashboard.html"],
  };

  /* =========================================================
     ACTIVE NAVIGATION UNDERLINE
  ========================================================= */

  const updateActiveNavigation = () => {
    if (!mainNav) return;

    const navLinks = mainNav.querySelectorAll(
      "a.nav-link, a.dropdown-link, .dropdown-menu a, .nav-dropdown a",
    );

    navLinks.forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    });

    if (homeButton) {
      homeButton.classList.remove("active");
      homeButton.removeAttribute("aria-current");
    }

    let activeGroup = "";

    Object.entries(pageGroups).forEach(([group, filenames]) => {
      if (filenames.includes(currentPage)) {
        activeGroup = group;
      }
    });

    // Match the regular navigation links with the current page.
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || href.startsWith("#")) return;

      let linkPage = "";

      try {
        linkPage = new URL(href, window.location.href).pathname
          .split("/")
          .pop()
          .toLowerCase();
      } catch {
        return;
      }

      // Home 1 / Home 2 dropdown items
      if (pageGroups.home.includes(linkPage)) {
        if (activeGroup === "home") {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
        return;
      }

      // Other navigation pages
      if (linkPage === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
        return;
      }

      // Support alternative filenames listed in pageGroups.
      const matchingGroup = Object.entries(pageGroups).find(([, filenames]) =>
        filenames.includes(linkPage),
      );

      if (matchingGroup && matchingGroup[0] === activeGroup) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    // Keep the Home dropdown button active on either Home page.
    if (homeButton && activeGroup === "home") {
      homeButton.classList.add("active");
      homeButton.setAttribute("aria-current", "page");
    }
  };

  /* =========================================================
     MENU ICON
  ========================================================= */

  const setMenuIcon = (open = false) => {
    if (!menuToggle) return;

    menuToggle.innerHTML = open
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';

    menuToggle.setAttribute("aria-label", open ? "Close Menu" : "Open Menu");

    menuToggle.setAttribute("title", open ? "Close Menu" : "Menu");
    menuToggle.setAttribute("aria-expanded", String(open));

    refreshIcons();
  };

  /* =========================================================
     HOME DROPDOWN
  ========================================================= */

  const closeDropdown = () => {
    if (dropdown) {
      dropdown.classList.remove("active");
    }

    if (homeButton) {
      homeButton.setAttribute("aria-expanded", "false");
    }

    // Closing the dropdown must not remove the active underline.
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
     MOBILE MENU
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

    // Preserve the active page underline after closing the menu.
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
     NAVIGATION LINK CLICKS
  ========================================================= */

  if (mainNav) {
    const navigationLinks = mainNav.querySelectorAll("a");

    navigationLinks.forEach((link) => {
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
     OUTSIDE CLICK
  ========================================================= */

  document.addEventListener("click", (event) => {
    if (!mainNav || !menuToggle) return;

    if (window.innerWidth > 820) {
      if (dropdown && !dropdown.contains(event.target)) {
        closeDropdown();
      }
      return;
    }

    const menuIsOpen = mainNav.classList.contains("active");

    if (!menuIsOpen) return;

    const clickedInsideMenu = mainNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* =========================================================
     HEADER SCROLL
  ========================================================= */

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 20);
  };

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  /* =========================================================
     RESPONSIVE RESET
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
     SHARED SCROLL REVEAL
  ========================================================= */

  const revealGroups = [
    {
      selector: ".reveal",
      visibleClass: "is-visible",
    },
    {
      selector: ".property-management .pm-reveal",
      visibleClass: "pm-visible",
    },
    {
      selector: ".rent-section .rent-reveal",
      visibleClass: "rent-visible",
    },
    {
      selector: ".lease-section .lease-reveal",
      visibleClass: "lease-visible",
    },
    {
      selector: ".financial-section .financial-reveal",
      visibleClass: "financial-visible",
    },
    {
      selector: ".property-cta .reveal",
      visibleClass: "visible",
    },
  ];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  revealGroups.forEach(({ selector, visibleClass }) => {
    const elements = document.querySelectorAll(selector);

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
      },
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  });

  /* =========================================================
     TENANT SCREENING CARD STAGGER
  ========================================================= */

  document.querySelectorAll(".screening-card").forEach((card, index) => {
    card.style.setProperty("--reveal-delay", `${(index % 3) * 120}ms`);
  });

  /* =========================================================
     INITIALIZE
  ========================================================= */

  updateActiveNavigation();
  closeMenu();
  updateHeader();
  refreshIcons();
});
