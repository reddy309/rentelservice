document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     LUCIDE ICON REFRESH
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
     MENU ICON
  ========================================================= */

  const setMenuIcon = (open = false) => {
    if (!menuToggle) {
      return;
    }

    menuToggle.innerHTML = open
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';

    menuToggle.setAttribute("aria-label", open ? "Close Menu" : "Open Menu");

    menuToggle.setAttribute("title", open ? "Close Menu" : "Menu");

    menuToggle.setAttribute("aria-expanded", String(open));

    refreshIcons();
  };

  /* =========================================================
     CLOSE HOME DROPDOWN
  ========================================================= */

  const closeDropdown = () => {
    if (dropdown) {
      dropdown.classList.remove("active");
    }

    if (homeButton) {
      homeButton.setAttribute("aria-expanded", "false");
    }
  };

  /* =========================================================
     TOGGLE HOME DROPDOWN
  ========================================================= */

  const toggleDropdown = () => {
    if (!dropdown) {
      return;
    }

    const isOpen = dropdown.classList.contains("active");

    dropdown.classList.toggle("active", !isOpen);

    if (homeButton) {
      homeButton.setAttribute("aria-expanded", String(!isOpen));
    }

    refreshIcons();
  };

  /* =========================================================
     CLOSE MOBILE MENU
  ========================================================= */

  const closeMenu = () => {
    if (mainNav) {
      mainNav.classList.remove("active");
    }

    closeDropdown();

    setMenuIcon(false);
  };

  /* =========================================================
     OPEN MOBILE MENU
  ========================================================= */

  const openMenu = () => {
    if (!mainNav) {
      return;
    }

    mainNav.classList.add("active");

    setMenuIcon(true);
  };

  /* =========================================================
     TOGGLE MOBILE MENU
  ========================================================= */

  const toggleMenu = () => {
    if (!mainNav) {
      return;
    }

    const isOpen = mainNav.classList.contains("active");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  /* =========================================================
     HAMBURGER CLICK
  ========================================================= */

  if (menuToggle) {
    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      toggleMenu();
    });
  }

  /* =========================================================
     HOME DROPDOWN BUTTON CLICK
  ========================================================= */

  if (homeButton && dropdown) {
    homeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      toggleDropdown();
    });
  }

  /* =========================================================
     NORMAL NAVIGATION LINKS
     No active-link handling
  ========================================================= */

  if (mainNav) {
    const navigationLinks = mainNav.querySelectorAll(
      "a.nav-link:not(.mobile-login)",
    );

    navigationLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 820) {
          closeMenu();
        }
      });
    });

    /* =======================================================
       HOME 1 / HOME 2 LINKS
    ======================================================= */

    const homeLinks = mainNav.querySelectorAll(
      ".dropdown-menu a, .nav-dropdown a",
    );

    homeLinks.forEach((link) => {
      link.addEventListener("click", () => {
        /*
          Allow normal browser navigation.
          No active-link handling.
        */

        if (window.innerWidth <= 820) {
          closeMenu();
        } else {
          closeDropdown();
        }
      });
    });

    /* =======================================================
       MOBILE LOGIN
    ======================================================= */

    const mobileLogin = mainNav.querySelector(".mobile-login");

    if (mobileLogin) {
      mobileLogin.addEventListener("click", () => {
        if (window.innerWidth <= 820) {
          closeMenu();
        }
      });
    }
  }

  /* =========================================================
     OUTSIDE CLICK
  ========================================================= */

  document.addEventListener("click", (event) => {
    if (!mainNav || !menuToggle) {
      return;
    }

    /* Desktop dropdown outside click */

    if (window.innerWidth > 820) {
      if (dropdown && !dropdown.contains(event.target)) {
        closeDropdown();
      }

      return;
    }

    /* Mobile menu outside click */

    const menuIsOpen = mainNav.classList.contains("active");

    if (!menuIsOpen) {
      return;
    }

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
    if (event.key !== "Escape") {
      return;
    }

    closeMenu();
  });

  /* =========================================================
     HEADER SCROLL
  ========================================================= */

  const updateHeader = () => {
    if (!header) {
      return;
    }

    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  /* =========================================================
     RESPONSIVE RESET
     <= 820px = Mobile / Tablet
     > 820px  = Desktop
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
     INITIAL HEADER STATE
  ========================================================= */

  closeMenu();

  updateHeader();

  refreshIcons();
});

/* =========================================
   SERVICE DETAILS HERO REVEAL
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const heroContent = document.querySelector(".service-details-content");

  if (!heroContent) return;

  /* Accessibility: reduced motion */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroContent.classList.add("visible");
    return;
  }

  /* Scroll reveal animation */
  if ("IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    heroObserver.observe(heroContent);
  } else {
    heroContent.classList.add("visible");
  }
});

/* =========================================
   KEY FEATURES & BENEFITS
   LUCIDE ICONS + SCROLL REVEAL
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  function initializeFeatureIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  initializeFeatureIcons();

  // Select all reveal elements
  const revealElements = document.querySelectorAll("#key-features .reveal");

  // Support browsers without IntersectionObserver
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
    return;
  }

  // Scroll reveal observer
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px",
    },
  );

  // Observe each element
  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
});

/* =====================================================
   RENT COLLECTION PROCESS — ICONS & REVEAL
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Render Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Reveal elements smoothly as they enter the viewport
  const section = document.querySelector("#rent-process");

  if (!section) return;

  const revealElements = [
    section.querySelector(".rent-eyebrow"),
    section.querySelector("h2"),
    section.querySelector(".rent-intro"),
    ...section.querySelectorAll(".rent-step"),
    section.querySelector(".rent-process-cta"),
    section.querySelector(".rent-process-visual"),
  ].filter(Boolean);

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
    return;
  }

  revealElements.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(18px)";
    element.style.transition =
      `opacity 0.55s ease ${Math.min(index * 0.07, 0.4)}s, ` +
      `transform 0.55s ease ${Math.min(index * 0.07, 0.4)}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach((element) => observer.observe(element));
});

/* =====================================================
   TENANT SCREENING — ICONS & SCROLL ANIMATION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const section = document.querySelector("#tenant-screening");

  if (!section) return;

  const elements = [
    ...section.querySelectorAll(
      ".tenant-screening-visual, " +
        ".tenant-eyebrow, " +
        ".tenant-screening-content > h2, " +
        ".tenant-intro, " +
        ".tenant-step, " +
        ".tenant-screening-cta",
    ),
  ];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
    return;
  }

  elements.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(18px)";

    element.style.transition =
      `opacity 0.55s ease ${Math.min(index * 0.06, 0.4)}s, ` +
      `transform 0.55s ease ${Math.min(index * 0.06, 0.4)}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  elements.forEach((element) => observer.observe(element));
});

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#property-inspection");

  if (!section) return;

  // Scroll reveal animation
  const revealElements = section.querySelectorAll(".reveal");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // Interactive inspection checklist
  const checklist = section.querySelector(".inspection-checklist");
  const progressText = section.querySelector("#inspection-progress");
  const progressBar = section.querySelector("#inspection-progress-bar");
  const progressTrack = section.querySelector("#inspection-progress-track");

  if (!checklist || !progressText || !progressBar || !progressTrack) {
    return;
  }

  const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');

  function updateProgress() {
    const completed = [...checkboxes].filter(
      (checkbox) => checkbox.checked,
    ).length;

    const total = checkboxes.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    progressText.textContent = `${completed} of ${total} reviewed`;
    progressBar.style.width = `${percentage}%`;

    progressTrack.setAttribute("aria-valuenow", completed);
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateProgress);
  });

  updateProgress();
});

/* =========================================
   PROPERTY MAINTENANCE WORKFLOW
   SCROLL REVEAL + LUCIDE ICONS
========================================= */

(function () {
  function initializeMaintenanceWorkflow() {
    const section = document.querySelector("#maintenance-workflow");

    if (!section) return;

    // Initialize Lucide icons.
    if (window.lucide) {
      window.lucide.createIcons();
    }

    const revealItems = section.querySelectorAll(".reveal");

    // Respect accessibility preferences.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Keep all content visible when animation is unnecessary
    // or IntersectionObserver is not supported.
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });

      return;
    }

    // Enable hidden reveal states only when initialization is ready.
    document.documentElement.classList.add("js-maintenance-reveal");

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const item = entry.target;

            item.classList.add("is-visible");
            observer.unobserve(item);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -35px 0px",
      },
    );

    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = (index % 4) * 100 + "ms";

      observer.observe(item);
    });
  }

  // Works whether the script loads before or after DOMContentLoaded.
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeMaintenanceWorkflow,
      { once: true },
    );
  } else {
    initializeMaintenanceWorkflow();
  }
})();

/* =========================================
   CONSULTATION CTA — ANIMATIONS
========================================= */

(function () {
  function initConsultationCTA() {
    const section = document.querySelector("#consultation-cta");

    if (!section) return;

    // Initialize icons.
    if (window.lucide) {
      window.lucide.createIcons();
    }

    const items = section.querySelectorAll(".reveal");

    // Respect reduced-motion preferences.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Show content without animation when needed.
    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    // Enable reveal animation only after initialization.
    document.documentElement.classList.add("js-consultation-reveal");

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    items.forEach(function (item, index) {
      item.style.transitionDelay = index * 120 + "ms";
      observer.observe(item);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConsultationCTA, {
      once: true,
    });
  } else {
    initConsultationCTA();
  }
})();
