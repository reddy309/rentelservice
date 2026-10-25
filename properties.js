/* =========================================================
   ESTATENEST - COMPLETE PROPERTIES PAGE JAVASCRIPT
   Header + Active Navigation + Search + Category Tabs
   + Scroll Reveal + Lucide Icons
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
     Add your real filenames if they are different.
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

    pricing: ["pricing.html", "pricing-page.html"],

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
     Properties subpages also activate Properties.
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

      if (!href || href.startsWith("#")) return;

      let linkPage;

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

      // Exact page match
      if (linkPage === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
        return;
      }

      // Related pages activate their main navigation link
      const matchedGroup = Object.entries(pageGroups).find(([group, pages]) =>
        pages.includes(linkPage),
      );

      if (matchedGroup && matchedGroup[0] === activeGroup) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    // Keep Home button active on Home pages
    if (homeButton && activeGroup === "home") {
      homeButton.classList.add("active");
      homeButton.setAttribute("aria-current", "page");
    }

    // Explicitly keep Properties main link active
    if (activeGroup === "properties") {
      const propertyLink = Array.from(allLinks).find((link) => {
        const href = link.getAttribute("href");

        if (!href || href.startsWith("#")) return false;

        try {
          const linkPage = new URL(href, window.location.href).pathname
            .split("/")
            .pop()
            .toLowerCase();

          return [
            "properties.html",
            "property.html",
            "properties-page.html",
          ].includes(linkPage);
        } catch (error) {
          return false;
        }
      });

      if (propertyLink) {
        propertyLink.classList.add("active");
        propertyLink.setAttribute("aria-current", "page");
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
     13. PROPERTIES HERO - SMOOTH SCROLL
  ========================================================= */

  const exploreButton = document.querySelector(
    '.properties-btn[href="#properties-list"]',
  );

  if (exploreButton) {
    exploreButton.addEventListener("click", (event) => {
      const target = document.querySelector("#properties-list");

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      }
    });
  }

  /* =========================================================
     14. PROPERTY SEARCH
  ========================================================= */

  const searchForm = document.getElementById("propertySearchForm");
  const keywordInput = document.getElementById("propertyKeyword");
  const locationSelect = document.getElementById("propertyLocation");
  const typeSelect = document.getElementById("propertyType");
  const searchMessage = document.getElementById("propertySearchMessage");
  const searchTags = document.querySelectorAll(".search-tag");

  if (
    searchForm &&
    keywordInput &&
    locationSelect &&
    typeSelect &&
    searchMessage
  ) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const keyword = keywordInput.value.trim();
      const location = locationSelect.value;
      const type = typeSelect.value;

      const params = new URLSearchParams();

      if (keyword) params.set("keyword", keyword);
      if (location) params.set("location", location);
      if (type) params.set("type", type);

      const query = params.toString();

      if (!query) {
        searchMessage.textContent =
          "Please enter a keyword or select a location or property type.";
        return;
      }

      searchMessage.textContent =
        "Search filters applied. Connect your property listings to display matching properties.";

      document.dispatchEvent(
        new CustomEvent("propertySearch", {
          detail: {
            keyword,
            location,
            type,
            params,
          },
        }),
      );

      // Keep the URL updated without reloading the page
      const searchUrl = new URL(window.location.href);

      searchUrl.search = query;

      window.history.replaceState(
        {},
        "",
        searchUrl.pathname + searchUrl.search + searchUrl.hash,
      );
    });

    searchTags.forEach((tag) => {
      tag.addEventListener("click", () => {
        if (tag.dataset.location) {
          locationSelect.value = tag.dataset.location;
        }

        if (tag.dataset.type) {
          typeSelect.value = tag.dataset.type;
        }

        searchTags.forEach((item) => {
          item.classList.remove("active");
        });

        tag.classList.add("active");

        searchMessage.textContent =
          "Filter selected. Click Search to apply it.";
      });
    });

    [keywordInput, locationSelect, typeSelect].forEach((field) => {
      field.addEventListener("change", () => {
        searchTags.forEach((tag) => {
          tag.classList.remove("active");
        });

        searchMessage.textContent = "";
      });
    });
  }

  /* =========================================================
     15. PROPERTY CATEGORY TABS
  ========================================================= */

  const categoryButtons = document.querySelectorAll(".category-btn");
  const categoryPanels = document.querySelectorAll(".category-panel");
  const categoryTitle = document.getElementById("category-title");
  const categoryDescription = document.getElementById("category-description");
  const propertyCount = document.getElementById("property-count");

  const categoryInfo = {
    featured: {
      title: "Featured Properties",
      description: "Explore our handpicked property collection.",
      count: 6,
    },

    apartments: {
      title: "Apartments Collection",
      description: "Discover apartments for comfortable modern living.",
      count: 3,
    },

    houses: {
      title: "Independent Houses",
      description: "Explore private homes with space for your family.",
      count: 3,
    },

    villas: {
      title: "Villas Collection",
      description: "Discover spacious villas with premium features.",
      count: 3,
    },

    commercial: {
      title: "Commercial Properties",
      description: "Find suitable spaces for your business.",
      count: 3,
    },
  };

  const revealObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.12,
            rootMargin: "0px 0px -20px 0px",
          },
        )
      : null;

  const observeRevealElements = (root = document) => {
    const elements = root.querySelectorAll(
      ".reveal:not(.revealed), .category-panel:not([hidden]) .property-card:not(.revealed)",
    );

    elements.forEach((element) => {
      if (revealObserver) {
        revealObserver.observe(element);
      } else {
        element.classList.add("revealed");
      }
    });
  };

  const activateCategory = (category, shouldScroll = false) => {
    const info = categoryInfo[category];

    if (!info) return;

    categoryButtons.forEach((button) => {
      const isActive = button.dataset.category === category;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    categoryPanels.forEach((panel) => {
      const isActive = panel.dataset.panel === category;

      panel.hidden = !isActive;

      if (isActive) {
        panel.querySelectorAll(".property-card").forEach((card) => {
          card.classList.remove("revealed");
        });
      }
    });

    if (categoryTitle) {
      categoryTitle.textContent = info.title;
    }

    if (categoryDescription) {
      categoryDescription.textContent = info.description;
    }

    if (propertyCount) {
      propertyCount.textContent = `${info.count} Properties`;
    }

    const activePanel = document.querySelector(
      `.category-panel[data-panel="${category}"]`,
    );

    if (activePanel) {
      observeRevealElements(activePanel);
    }

    refreshIcons();

    if (shouldScroll && activePanel) {
      activePanel.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }
  };

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateCategory(button.dataset.category, true);
    });
  });

  // Initialize the first active category, without forced scrolling.
  const initialCategoryButton =
    document.querySelector(".category-btn.active") ||
    document.querySelector('.category-btn[data-category="featured"]');

  if (initialCategoryButton) {
    activateCategory(initialCategoryButton.dataset.category, false);
  }

  /* =========================================
   AMENITIES & RENTAL PRICE SCROLL REVEAL
========================================= */

  const revealSections = document.querySelectorAll(
    ".amenities-section .reveal-left, " +
      ".amenities-section .reveal-right, " +
      ".rental-price-section .reveal",
  );

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
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

    revealSections.forEach((element) => {
      sectionObserver.observe(element);
    });
  } else {
    revealSections.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* =========================================================
     17. RENTAL PRICE SCROLL REVEAL
  ========================================================= */

  const rentalSection = document.querySelector(".rental-price-section");

  if (rentalSection) {
    const rentalItems = rentalSection.querySelectorAll(".reveal");

    if (revealObserver) {
      rentalItems.forEach((element) => {
        revealObserver.observe(element);
      });
    } else {
      rentalItems.forEach((element) => {
        element.classList.add("is-visible");
      });
    }
  }

  /* =========================================================
   18. LIST YOUR PROPERTY CTA — SCROLL REVEAL
========================================================= */

  const listPropertyCTA = document.querySelector(".list-property-cta");

  if (listPropertyCTA) {
    const ctaItems = listPropertyCTA.querySelectorAll(".cta-reveal");

    if ("IntersectionObserver" in window) {
      const ctaObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -25px 0px",
        },
      );

      ctaItems.forEach((element) => {
        ctaObserver.observe(element);
      });
    } else {
      ctaItems.forEach((element) => {
        element.classList.add("is-visible");
      });
    }

    /* Refresh Lucide icons */
    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }
  }

  /* =========================================================
     19. GENERAL SCROLL REVEAL
  ========================================================= */

  const generalRevealItems = document.querySelectorAll(
    ".reveal, .property-management .pm-reveal, " +
      ".rent-section .rent-reveal, .lease-section .lease-reveal, " +
      ".financial-section .financial-reveal, .property-cta .reveal",
  );

  generalRevealItems.forEach((element) => {
    if (revealObserver) {
      revealObserver.observe(element);
    } else {
      element.classList.add("is-visible");
      element.classList.add("pm-visible");
      element.classList.add("rent-visible");
      element.classList.add("lease-visible");
      element.classList.add("financial-visible");
      element.classList.add("visible");
    }
  });

  /* =========================================================
     20. INITIALIZE PAGE
  ========================================================= */

  updateActiveNavigation();
  closeMenu();
  updateHeader();
  observeRevealElements();
  refreshIcons();
});
