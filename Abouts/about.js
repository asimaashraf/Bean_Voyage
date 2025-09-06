document.addEventListener("DOMContentLoaded", () => {
    const aboutBox = document.querySelector(".about-box");
    aboutBox.style.opacity = "0";
    aboutBox.style.transform = "translateY(50px)";
    aboutBox.style.transition = "all 0.8s ease-in-out";

    setTimeout(() => {
        aboutBox.style.opacity = "1";
        aboutBox.style.transform = "translateY(0)";
    }, 200);
});
