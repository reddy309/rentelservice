/* =========================================================
   ESTATENEST — PROPERTY OWNER DASHBOARD
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const menuToggle = document.getElementById("menuToggle");

  const profileWrapper = document.querySelector(".admin-profile-wrapper");

  const profileButton = document.getElementById("adminProfileButton");

  const darkToggle = document.getElementById("darkToggle");
  const rtlToggle = document.getElementById("rtlToggle");

  const headerLabel = document.getElementById("headerLabel");
  const headerTitle = document.getElementById("headerTitle");

  const toast = document.getElementById("toast");

  let toastTimeout;

  /* PAGE TITLES */

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

  /* ICON REFRESH */

  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /* TOAST */

  function showToast(message) {
    if (!toast) return;

    clearTimeout(toastTimeout);

    toast.textContent = message;
    toast.classList.add("show");

    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  /* SIDEBAR */

  function openSidebar() {
    if (!sidebar) return;

    sidebar.classList.add("open");

    if (sidebarOverlay) {
      sidebarOverlay.classList.add("show");
    }

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

  function closeSidebar() {
    if (!sidebar) return;

    sidebar.classList.remove("open");

    if (sidebarOverlay) {
      sidebarOverlay.classList.remove("show");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    }

    document.body.style.overflow = "";

    refreshIcons();
  }

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      if (sidebar && sidebar.classList.contains("open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeSidebar();
    }
  });

  /* PROFILE DROPDOWN */

  function closeProfileDropdown() {
    if (!profileWrapper) return;

    profileWrapper.classList.remove("open");

    if (profileButton) {
      profileButton.setAttribute("aria-expanded", "false");
    }
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

  /* PAGE NAVIGATION */

  function showPage(pageName, updateHash = true) {
    if (!pageData[pageName]) {
      pageName = "dashboard";
    }

    document.querySelectorAll(".dynamic-page").forEach((page) => {
      page.hidden = true;
    });

    const target = document.querySelector(
      `.dynamic-page[data-content="${pageName}"]`,
    );

    if (target) {
      target.hidden = false;
    }

    document.querySelectorAll(".nav-item[data-page]").forEach((item) => {
      const active = item.dataset.page === pageName;

      item.classList.toggle("active", active);

      if (active) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });

    if (headerLabel) {
      headerLabel.textContent = pageData[pageName].label;
    }

    if (headerTitle) {
      headerTitle.textContent = pageData[pageName].title;
    }

    closeSidebar();
    closeProfileDropdown();

    if (updateHash && window.location.hash !== `#${pageName}`) {
      history.replaceState(null, "", `#${pageName}`);
    }

    refreshIcons();
  }

  document.querySelectorAll(".nav-item[data-page]").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      showPage(item.dataset.page);
    });
  });

  document.querySelectorAll("[data-page-link]").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      showPage(item.dataset.pageLink);
    });
  });

  window.addEventListener("hashchange", () => {
    const pageName = window.location.hash.slice(1);

    showPage(pageData[pageName] ? pageName : "dashboard", false);
  });

  /* DARK MODE */

  function updateThemeIcon() {
    if (!darkToggle) return;

    const isDark = root.classList.contains("dark");

    darkToggle.innerHTML = isDark
      ? '<i data-lucide="sun"></i>'
      : '<i data-lucide="moon"></i>';

    darkToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );

    refreshIcons();
  }

  darkToggle?.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark");

    try {
      localStorage.setItem("estatenest-theme", isDark ? "dark" : "light");
    } catch (error) {
      // Theme still works if browser storage is unavailable.
    }

    updateThemeIcon();
  });

  /* RTL MODE */

  function updateRTLButton() {
    if (!rtlToggle) return;

    const isRTL = root.classList.contains("rtl");

    rtlToggle.setAttribute("aria-pressed", String(isRTL));

    rtlToggle.setAttribute(
      "aria-label",
      isRTL
        ? "Switch to left-to-right layout"
        : "Switch to right-to-left layout",
    );
  }

  function setRTL(enabled) {
    root.classList.toggle("rtl", enabled);
    root.setAttribute("dir", enabled ? "rtl" : "ltr");

    try {
      localStorage.setItem("estatenest-direction", enabled ? "rtl" : "ltr");
    } catch (error) {
      // RTL still works if browser storage is unavailable.
    }

    updateRTLButton();
    refreshIcons();
  }

  rtlToggle?.addEventListener("click", () => {
    setRTL(!root.classList.contains("rtl"));
  });

  /* SETTINGS PAGE THEME BUTTONS */

  document.querySelectorAll('[data-setting="dark"]').forEach((button) => {
    button.addEventListener("click", () => {
      const isDark = root.classList.toggle("dark");

      try {
        localStorage.setItem("estatenest-theme", isDark ? "dark" : "light");
      } catch (error) {
        // Ignore unavailable storage.
      }

      updateThemeIcon();

      showToast(
        isDark ? "Dark appearance enabled." : "Light appearance enabled.",
      );
    });
  });

  document.querySelectorAll('[data-setting="rtl"]').forEach((button) => {
    button.addEventListener("click", () => {
      const isRTL = !root.classList.contains("rtl");

      setRTL(isRTL);

      showToast(
        isRTL
          ? "Right-to-left layout enabled."
          : "Left-to-right layout enabled.",
      );
    });
  });

  /* SEARCH FILTERS */

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

  /* DEMO ACTION MESSAGES */

  document.querySelectorAll("[data-notice]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(button.dataset.notice);
    });
  });

  /* LOGOUT */

  document
    .querySelectorAll("#sidebarLogoutButton, #adminLogoutButton")
    .forEach((button) => {
      button.addEventListener("click", () => {
        /*
        Connect this action to your actual owner authentication
        system before using it in production.

        This demo redirects to login.html.
      */

        closeSidebar();
        closeProfileDropdown();

        window.location.href = "login.html";
      });
    });

  /* ESCAPE KEY */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar();
      closeProfileDropdown();
    }
  });

  /* RESTORE PREFERENCES */

  try {
    const savedTheme = localStorage.getItem("estatenest-theme");
    const savedDirection = localStorage.getItem("estatenest-direction");

    if (savedTheme === "dark") {
      root.classList.add("dark");
    } else if (savedTheme === "light") {
      root.classList.remove("dark");
    }

    if (savedDirection === "rtl") {
      root.classList.add("rtl");
      root.setAttribute("dir", "rtl");
    } else if (savedDirection === "ltr") {
      root.classList.remove("rtl");
      root.setAttribute("dir", "ltr");
    }
  } catch (error) {
    // Default light, LTR dashboard remains functional.
  }

  /* INITIALIZE */

  updateThemeIcon();
  updateRTLButton();

  const initialPage = window.location.hash.slice(1);

  showPage(pageData[initialPage] ? initialPage : "dashboard", false);

  refreshIcons();
});
