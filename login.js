document.addEventListener("DOMContentLoaded", function () {
  // =========================================
  // 1. RENDER LUCIDE ICONS
  // =========================================

  function renderIcons() {
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  renderIcons();

  // =========================================
  // 2. PASSWORD SHOW / HIDE
  // =========================================

  const password = document.getElementById("password");
  const passwordToggle = document.getElementById("passwordToggle");

  if (password && passwordToggle) {
    passwordToggle.innerHTML = '<i data-lucide="eye"></i>';

    passwordToggle.addEventListener("click", function () {
      const isPassword = password.type === "password";

      password.type = isPassword ? "text" : "password";

      passwordToggle.innerHTML = isPassword
        ? '<i data-lucide="eye-off"></i>'
        : '<i data-lucide="eye"></i>';

      passwordToggle.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password",
      );

      passwordToggle.setAttribute(
        "aria-pressed",
        isPassword ? "true" : "false",
      );

      renderIcons();
    });
  }

  // =========================================
  // 3. LOGIN FORM VALIDATION
  // =========================================

  const loginForm = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const formMessage = document.getElementById("formMessage");

  if (loginForm && email && password && formMessage) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!email.checkValidity()) {
        formMessage.textContent = "Please enter a valid email address.";
        email.focus();
        return;
      }

      if (password.value.length < 6) {
        formMessage.textContent =
          "Password must contain at least 6 characters.";
        password.focus();
        return;
      }

      formMessage.textContent =
        "Form validated. Connect your backend to sign in.";
    });

    [email, password].forEach(function (input) {
      input.addEventListener("input", function () {
        formMessage.textContent = "";
      });
    });
  }

  // =========================================
  // 4. GOOGLE LOGIN PLACEHOLDER
  // =========================================

  const googleLogin = document.getElementById("googleLogin");

  if (googleLogin) {
    googleLogin.addEventListener("click", function () {
      alert("Google login requires Google authentication setup.");
    });
  }

  // =========================================
  // 5. APPLE LOGIN PLACEHOLDER
  // =========================================

  const appleLogin = document.getElementById("appleLogin");

  if (appleLogin) {
    appleLogin.addEventListener("click", function () {
      alert("Apple login requires Apple authentication setup.");
    });
  }
});
