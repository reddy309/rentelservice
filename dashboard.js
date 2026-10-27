/* =========================================================
   ESTATENEST — PROPERTY OWNER DASHBOARD
   Complete Updated JavaScript

   Features:
   1. Fixed Dashboard Header
   2. Sidebar Page Navigation
   3. Active Sidebar Button
   4. URL Hash Navigation
   5. Mobile Sidebar Toggle
   6. Sidebar Overlay
   7. Profile Dropdown
   8. Search Filters
   9. Toast Notifications
   10. Logout
   11. Lucide Icon Refresh
   12. Escape Key Support
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================================
     1. ELEMENT SELECTORS
  ===================================================== */

  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const menuToggle = document.getElementById("menuToggle");

  const profileWrapper = document.querySelector(".admin-profile-wrapper");
  const profileButton = document.getElementById("adminProfileButton");

  const headerLabel = document.getElementById("headerLabel");
  const headerTitle = document.getElementById("headerTitle");

  const toast = document.getElementById("toast");

  let toastTimeout;

  /* =====================================================
     2. FIXED DASHBOARD HEADER
     Header text NEVER changes when navigating pages
  ===================================================== */

  if (headerLabel) {
    headerLabel.textContent = "PROPERTY OWNER PORTAL";
  }

  if (headerTitle) {
    headerTitle.textContent = "Welcome to EstateNest";
  }

  /* =====================================================
     3. PAGE DATA
     Used for navigation validation
  ===================================================== */

  const pageData = {
    dashboard: {
      label: "PROPERTY OWNER PORTAL",
      title: "Welcome to EstateNest",
    },

    properties: {
      label: "PROPERTY MANAGEMENT",
      title: "My Properties",
    },

    tenants: {
      label: "TENANT MANAGEMENT",
      title: "Tenant Management",
    },

    rent: {
      label: "RENT COLLECTION",
      title: "Rent Collection",
    },

    maintenance: {
      label: "PROPERTY MAINTENANCE",
      title: "Maintenance Requests",
    },

    reports: {
      label: "FINANCIAL OVERVIEW",
      title: "Financial Reports",
    },

    services: {
      label: "PROPERTY SERVICES",
      title: "Our Management Services",
    },

    notifications: {
      label: "UPDATES & ALERTS",
      title: "Notifications",
    },

    settings: {
      label: "ACCOUNT PREFERENCES",
      title: "Account Settings",
    },

    profile: {
      label: "OWNER ACCOUNT",
      title: "My Profile",
    },
  };

  /* =====================================================
     4. LUCIDE ICON REFRESH
  ===================================================== */

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  /* =====================================================
     5. TOAST NOTIFICATION
  ===================================================== */

  function showToast(message) {
    if (!toast) return;

    clearTimeout(toastTimeout);

    toast.textContent = message;
    toast.classList.add("show");

    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  /* =====================================================
     6. SIDEBAR OPEN
  ===================================================== */

  function openSidebar() {
    if (!sidebar) return;

    sidebar.classList.add("open");
    sidebarOverlay?.classList.add("show");

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close navigation");
      menuToggle.innerHTML = '<i data-lucide="x"></i>';
    }

    if (window.innerWidth <= 900) {
      document.body.style.overflow = "hidden";
    }

    refreshIcons();
  }

  /* =====================================================
     7. SIDEBAR CLOSE
  ===================================================== */

  function closeSidebar() {
    sidebar?.classList.remove("open");
    sidebarOverlay?.classList.remove("show");

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    }

    document.body.style.overflow = "";

    refreshIcons();
  }

  /* =====================================================
     8. MOBILE MENU BUTTON
  ===================================================== */

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      if (sidebar?.classList.contains("open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  sidebarOverlay?.addEventListener("click", closeSidebar);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeSidebar();
    }
  });

  /* =====================================================
     9. PROFILE DROPDOWN
  ===================================================== */

  function closeProfileDropdown() {
    profileWrapper?.classList.remove("open");
    profileButton?.setAttribute("aria-expanded", "false");
  }

  if (profileButton && profileWrapper) {
    profileButton.setAttribute("aria-expanded", "false");

    profileButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = profileWrapper.classList.toggle("open");

      profileButton.setAttribute("aria-expanded", String(isOpen));
    });

    profileWrapper.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    document.addEventListener("click", closeProfileDropdown);
  }

  /* =====================================================
     10. PAGE NAVIGATION
     Changes page content and active sidebar item only.
     Dashboard header remains fixed.
  ===================================================== */

  function showPage(pageName, updateHash = true) {
    if (!pageData[pageName]) {
      pageName = "dashboard";
    }

    /* Hide all dashboard page sections */

    document.querySelectorAll(".dynamic-page").forEach((page) => {
      page.hidden = true;
    });

    /* Show selected page section */

    const target = document.querySelector(
      `.dynamic-page[data-content="${pageName}"]`,
    );

    if (target) {
      target.hidden = false;
    }

    /* Update active sidebar button */

    document.querySelectorAll(".nav-item[data-page]").forEach((item) => {
      const isActive = item.dataset.page === pageName;

      item.classList.toggle("active", isActive);

      if (isActive) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });

    /*
      IMPORTANT:
      Do not update headerLabel or headerTitle here.
      Header always displays:
      PROPERTY OWNER PORTAL
      Welcome to EstateNest
    */

    /* Close mobile sidebar and profile menu */

    closeSidebar();
    closeProfileDropdown();

    /* Update URL hash without reloading */

    if (updateHash && window.location.hash !== `#${pageName}`) {
      history.replaceState(null, "", `#${pageName}`);
    }

    refreshIcons();
  }

  /* =====================================================
     11. SIDEBAR NAVIGATION BUTTONS
  ===================================================== */

  document.querySelectorAll(".nav-item[data-page]").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      showPage(item.dataset.page);
    });
  });

  /* =====================================================
     12. OTHER PAGE LINKS
  ===================================================== */

  document.querySelectorAll("[data-page-link]").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      showPage(item.dataset.pageLink);
    });
  });

  /* =====================================================
     13. URL HASH CHANGE
     Supports #dashboard, #properties, #tenants, etc.
  ===================================================== */

  window.addEventListener("hashchange", () => {
    const pageName = window.location.hash.slice(1);

    showPage(pageData[pageName] ? pageName : "dashboard", false);
  });

  /* =====================================================
     14. SEARCH FILTERS
     Requires:
     input[data-search="properties"]
     container[data-list="properties"]
     rows with class .content-row
  ===================================================== */

  document.querySelectorAll("[data-search]").forEach((input) => {
    input.addEventListener("input", () => {
      const listName = input.dataset.search;

      const list = document.querySelector(`[data-list="${listName}"]`);

      if (!list) return;

      const query = input.value.trim().toLowerCase();

      const rows = list.querySelectorAll(".content-row");

      let visibleCount = 0;

      rows.forEach((row) => {
        const matches = row.textContent.toLowerCase().includes(query);

        row.hidden = !matches;

        if (matches) {
          visibleCount++;
        }
      });

      const page = input.closest(".page-content");
      const emptyState = page?.querySelector(".empty-state");

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    });
  });

  /* =====================================================
     15. DEMO ACTION NOTIFICATIONS
  ===================================================== */

  document.querySelectorAll("[data-notice]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(button.dataset.notice);
    });
  });

  /* =====================================================
     16. LOGOUT
  ===================================================== */

  document
    .querySelectorAll("#sidebarLogoutButton, #adminLogoutButton")
    .forEach((button) => {
      button.addEventListener("click", () => {
        closeSidebar();
        closeProfileDropdown();

        window.location.href = "login.html";
      });
    });

  /* =====================================================
     17. ESCAPE KEY
  ===================================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar();
      closeProfileDropdown();
    }
  });

  /* =====================================================
     18. INITIALIZE DASHBOARD
     Open the page specified by the URL hash.
  ===================================================== */

  const initialPage = window.location.hash.slice(1);

  showPage(pageData[initialPage] ? initialPage : "dashboard", false);

  /* Ensure fixed header text is correct on startup */

  if (headerLabel) {
    headerLabel.textContent = "PROPERTY OWNER PORTAL";
  }

  if (headerTitle) {
    headerTitle.textContent = "Welcome to EstateNest";
  }

  refreshIcons();
});
