document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const passwordManager = document.getElementById("passwordManager");
  const themeToggle = document.getElementById("themeToggle");
  const generateBtn = document.getElementById("generateBtn");
  const currentPasswordInput = document.getElementById("currentPassword");
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const socialButtons = document.querySelectorAll(".social-buttons .btn");
  const copyButtons = document.querySelectorAll(".password-manager .btn-icon");

  // Estado
  let currentPassword = "";
  const passwords = {};

  // Funciones
  function toggleTheme() {
    if (passwordManager.classList.contains("dark")) {
      passwordManager.classList.remove("dark");
      passwordManager.classList.add("light");
      localStorage.setItem("theme", "light");
      themeToggle.innerHTML = '<i class="mdi mdi-weather-night"></i>';
    } else {
      passwordManager.classList.remove("light");
      passwordManager.classList.add("dark");
      localStorage.setItem("theme", "dark");
      themeToggle.innerHTML = '<i class="mdi mdi-white-balance-sunny"></i>';
    }
  }

  function generatePassword() {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentPassword = password;
    currentPasswordInput.value = password;
  }

  function savePassword(network) {
    if (currentPassword) {
      passwords[network] = currentPassword;
      updatePasswordManager();
      currentPassword = "";
      currentPasswordInput.value = "";
    }
  }

  function updatePasswordManager() {
    const passwordItems = document.querySelectorAll(".password-item");
    passwordItems.forEach((item) => {
      const network = item.querySelector("label").textContent.replace(":", "");
      const input = item.querySelector("input");
      const copyBtn = item.querySelector(".btn-icon");
      if (passwords[network]) {
        input.value = passwords[network];
        copyBtn.disabled = false;
      } else {
        input.value = "";
        input.placeholder = "Sin contraseña guardada";
        copyBtn.disabled = true;
      }
    });
  }

  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Contraseña copiada al portapapeles");
      })
      .catch((err) => {
        console.error("Error al copiar: ", err);
      });
  }

  // Manejadores de eventos
  themeToggle.addEventListener("click", toggleTheme);
  generateBtn.addEventListener("click", generatePassword);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const tabId = tab.getAttribute("data-tab");
      tabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.id === `${tabId}Tab`) {
          content.classList.add("active");
        }
      });
    });
  });

  socialButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const network = button.getAttribute("data-network");
      savePassword(network);
    });
  });

  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const passwordInput = button.previousElementSibling;
      copyToClipboard(passwordInput.value);
    });
  });

  // Inicialización
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    passwordManager.classList.add("dark");
    themeToggle.innerHTML = '<i class="mdi mdi-white-balance-sunny"></i>';
  } else {
    passwordManager.classList.add("light");
    themeToggle.innerHTML = '<i class="mdi mdi-weather-night"></i>';
  }
});
