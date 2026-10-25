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
     3. MENU ICON
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
     4. HOME DROPDOWN
  ========================================================= */

  const closeDropdown = () => {
    if (dropdown) {
      dropdown.classList.remove("active");
    }

    if (homeButton) {
      homeButton.setAttribute("aria-expanded", "false");
    }
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

  if (homeButton && dropdown) {
    homeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      toggleDropdown();
    });
  }

  /* =========================================================
     5. MOBILE MENU
  ========================================================= */

  const closeMenu = () => {
    if (mainNav) {
      mainNav.classList.remove("active");
    }

    closeDropdown();
    setMenuIcon(false);
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

  /* =========================================================
     6. ACTIVE NAVIGATION
     Contact page active underline
  ========================================================= */

  const getPageName = (href) => {
    if (!href) return "";

    return href.split(/[?#]/)[0].split("/").pop().toLowerCase();
  };

  const currentPage = getPageName(window.location.pathname);

  const contactPageNames = [
    "contact.html",
    "contact-us.html",
    "contact-page.html",
  ];

  if (mainNav) {
    const navLinks = mainNav.querySelectorAll(
      "a.nav-link, .dropdown-menu a, .nav-dropdown a",
    );

    navLinks.forEach((link) => {
      const linkPage = getPageName(link.getAttribute("href"));

      if (contactPageNames.includes(currentPage)) {
        const isContactLink = contactPageNames.includes(linkPage);

        link.classList.toggle("active", isContactLink);
      }

      link.addEventListener("click", () => {
        if (window.innerWidth <= 820) {
          closeMenu();
        } else if (
          link.closest(".dropdown-menu") ||
          link.closest(".nav-dropdown")
        ) {
          closeDropdown();
        }
      });
    });

    /* Mobile login */

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
     7. OUTSIDE CLICK
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
     8. ESCAPE KEY
  ========================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* =========================================================
     9. HEADER SCROLL
  ========================================================= */

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 20);
  };

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  /* =========================================================
     10. RESPONSIVE RESET
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
     11. SHARED SCROLL REVEAL
     Supports .reveal, .show and .is-visible
  ========================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  const showReveal = (element) => {
    element.classList.add("show");
    element.classList.add("is-visible");
  };

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion) {
    revealElements.forEach(showReveal);
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showReveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      },
    );

    revealElements.forEach((element, index) => {
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 100, 300)}ms`,
      );

      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(showReveal);
  }

  /* =========================================================
     12. PROPERTY OWNER ENQUIRY FORM
  ========================================================= */

  const enquiryForm = document.getElementById("ownerEnquiryForm");
  const formMessage = document.getElementById("ownerFormMessage");

  if (enquiryForm && formMessage) {
    enquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();

      formMessage.textContent = "";
      formMessage.className = "owner-form-message";

      if (!enquiryForm.checkValidity()) {
        enquiryForm.reportValidity();
        return;
      }

      const getValue = (id) => {
        const field = document.getElementById(id);
        return field ? field.value.trim() : "";
      };

      const phone = getValue("ownerPhone");
      const phoneDigits = phone.replace(/\D/g, "");

      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        formMessage.textContent = "Please enter a valid phone number.";

        formMessage.classList.add("error");
        return;
      }

      const enquiryDetails = {
        name: getValue("ownerName"),
        email: getValue("ownerEmail"),
        phone,
        propertyType: getValue("propertyType"),
        propertyLocation: getValue("propertyLocation"),
        propertyStatus: getValue("propertyStatus"),
        serviceRequired: getValue("serviceRequired"),
        message: getValue("ownerMessage"),
      };

      // Demo only: a backend is required to submit the enquiry.
      console.log("Property Owner Enquiry:", enquiryDetails);

      formMessage.textContent =
        "Form validated successfully. Connect a backend or form service to send your enquiry to EstateNest.";

      formMessage.classList.add("success");
    });
  }

  /* =========================================================
     13. FAQ ACCORDION
  ========================================================= */

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    if (!question) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      faqItems.forEach((faq) => {
        faq.classList.remove("active");

        const button = faq.querySelector(".faq-question");

        if (button) {
          button.setAttribute("aria-expanded", "false");
        }
      });

      if (!isOpen) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* =========================================================
     14. PROPERTY CTA
     Uses the shared scroll reveal above
  ========================================================= */

  const ctaSection = document.querySelector(".property-cta-section");

  if (ctaSection && reduceMotion) {
    ctaSection.querySelectorAll(".reveal").forEach(showReveal);
  }

  /* =========================================================
     15. INITIAL STATE
  ========================================================= */

  closeMenu();
  updateHeader();
  refreshIcons();
});
