document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // ✅ Contact form handling
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = {
                name: contactForm.querySelector('input[name="name"]').value,
                email: contactForm.querySelector('input[name="email"]').value,
                address: contactForm.querySelector('input[name="address"]').value,
                message: contactForm.querySelector('textarea[name="message"]').value,
            };

            try {
                const response = await fetch("http://localhost:5000/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                alert(data.message);

                if (response.ok) {
                    contactForm.reset(); // clear form
                }
            } catch (err) {
                alert("Server Error ❌");
            }
        });
    }
});
