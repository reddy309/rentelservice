document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     01. LUCIDE ICONS
  ========================================= */

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  refreshIcons();

  /* =========================================
     02. PASSWORD VISIBILITY
  ========================================= */

  document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const wrapper = button.closest(".password-wrapper");
      const input = wrapper ? wrapper.querySelector("input") : null;

      if (!input) return;

      const showPassword = input.type === "password";

      input.type = showPassword ? "text" : "password";

      const icon = button.querySelector("[data-lucide]");

      if (icon) {
        icon.setAttribute("data-lucide", showPassword ? "eye-off" : "eye");
      }

      button.setAttribute(
        "aria-label",
        showPassword ? "Hide password" : "Show password",
      );

      refreshIcons();
    });
  });

  /* =========================================
     03. SIGNUP FORM VALIDATION
  ========================================= */

  const signupForm = document.querySelector(".signup-form");
  const formMessage = document.querySelector(".form-message");

  if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (formMessage) {
        formMessage.textContent = "";
        formMessage.classList.remove("error");
      }

      /* Validate required fields */

      if (!signupForm.checkValidity()) {
        signupForm.reportValidity();
        return;
      }

      /* Get password fields */

      const password = signupForm.querySelector(
        'input[name="password"], #password',
      );

      const confirmPassword = signupForm.querySelector(
        'input[name="confirmPassword"], #confirmPassword',
      );

      /* Check whether passwords match */

      if (
        password &&
        confirmPassword &&
        password.value !== confirmPassword.value
      ) {
        if (formMessage) {
          formMessage.textContent = "Passwords do not match.";
          formMessage.classList.add("error");
        } else {
          alert("Passwords do not match.");
        }

        confirmPassword.focus();
        return;
      }

      /* Validation successful */

      if (formMessage) {
        formMessage.classList.remove("error");
        formMessage.textContent =
          "Validation successful. Connect your backend to create your account.";
      } else {
        alert(
          "Validation successful. Connect your backend to create your account.",
        );
      }
    });
  }

  /* =========================================
     04. INITIALIZE ICONS
  ========================================= */

  refreshIcons();
});
