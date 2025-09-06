document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".navbar ul");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            menu.classList.toggle("show");
        });

        menu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => menu.classList.remove("show"));
        });
    }
});
