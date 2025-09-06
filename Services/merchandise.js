// Hamburger toggle
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Optional click alert
document.querySelectorAll('.card').forEach(item => {
  item.addEventListener('click', () => {
    alert("Thanks for showing interest! Shop feature coming soon 😊");
  });
});
