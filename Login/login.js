document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');

    // ✅ Toggle forms
    if (container && registerBtn && loginBtn) {
        registerBtn.addEventListener('click', () => container.classList.add('active'));
        loginBtn.addEventListener('click', () => container.classList.remove('active'));
    }

    // ✅ Navbar toggle
   const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".navbar ul");
if (toggle && menu) {
    toggle.addEventListener("click", () => menu.classList.toggle("show"));
    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => menu.classList.remove("show"));
    });
}




    const loginForm = document.querySelector(".form-box.login form");
    const registerForm = document.querySelector(".form-box.register form");

    // ✅ Register Form
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = registerForm.querySelector('input[name="username"]').value;
            const email = registerForm.querySelector('input[name="email"]').value;
            const password = registerForm.querySelector('input[name="password"]').value;

            try {
                const response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();
                alert(data.message);

                if (response.ok && container) {
                    // ✅ After successful registration, show login form
                    container.classList.remove('active');  
                }
            } catch (err) {
                alert("Server Error ❌");
            }
        });
    }

    // ✅ Login Form
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[name="email"]').value;
            const password = loginForm.querySelector('input[name="password"]').value;

            try {
                const response = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                alert(data.message);

                if (response.ok) {
                    // ✅ Redirect to home page after successful login
                    window.location.href = "../frontend/index.html";
                }
            } catch (err) {
                alert("Server Error ❌");
            }
        });
    }
});
