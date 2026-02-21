(() => {
  const root = document.documentElement;
  const toggleButton = document.getElementById("themeToggle");

  const isValidTheme = (theme) => theme === "light" || theme === "dark";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (toggleButton) {
      const isDark = theme === "dark";
      const next = isDark ? "light" : "dark";
      toggleButton.setAttribute("aria-pressed", String(isDark));
      toggleButton.setAttribute("aria-label", `Switch to ${next} mode`);
      toggleButton.title = `Switch to ${next} mode`;
      toggleButton.textContent = "Toggle theme";
    }

    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }

  function getCurrentTheme() {
    const attrTheme = root.getAttribute("data-theme");
    if (isValidTheme(attrTheme)) return attrTheme;

    try {
      const saved = localStorage.getItem("theme");
      if (isValidTheme(saved)) return saved;
    } catch (e) {}

    return "light";
  }

  applyTheme(getCurrentTheme());

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      const current = getCurrentTheme();
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
})();
