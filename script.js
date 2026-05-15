(function () {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const initialTheme = savedTheme || (prefersLight ? "light" : "dark");

    root.dataset.theme = initialTheme;

    function updateThemeButtons() {
        document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
            const isLight = root.dataset.theme === "light";
            button.textContent = isLight ? "☀️" : "🌙";
            button.setAttribute("aria-label", isLight ? "Passer au thème sombre" : "Passer au thème clair");
            button.title = isLight ? "Thème sombre" : "Thème clair";
        });
    }

    window.addEventListener("DOMContentLoaded", () => {
        updateThemeButtons();

        document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
            button.addEventListener("click", () => {
                root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
                localStorage.setItem("theme", root.dataset.theme);
                updateThemeButtons();
            });
        });

        document.querySelectorAll("[data-copy]").forEach((button) => {
            button.addEventListener("click", async () => {
                const code = button.closest(".code-block")?.querySelector("pre")?.innerText || "";
                await navigator.clipboard.writeText(code);
                const oldText = button.textContent;
                button.textContent = "Copié";
                setTimeout(() => { button.textContent = oldText; }, 1600);
            });
        });

        const links = document.querySelectorAll(".toc a[href^='#']");
        const sections = [...document.querySelectorAll(".lesson[id]")];

        if (links.length && sections.length) {
            const updateToc = () => {
                const current = sections
                    .filter((section) => section.getBoundingClientRect().top <= 155)
                    .at(-1)?.id || sections[0].id;

                links.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
                });
            };

            window.addEventListener("scroll", updateToc, { passive: true });
            updateToc();
        }
    });
})();
