// ================== Toggle online payment options ==================
function toggleOnlineOptions() {
  const payment = document.getElementById("payment").value;
  const onlineOptions = document.getElementById("online-options");
  const paymentDetails = document.getElementById("payment-details");

  if (payment === "Online Payment") {
    onlineOptions.style.display = "block";
  } else {
    onlineOptions.style.display = "none";
    paymentDetails.style.display = "none";
  }
}

// ================== Scroll inputs into view on focus ==================
document.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("focus", () => {
    field.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
});

// ================== Load cart items on page load ==================
document.addEventListener("DOMContentLoaded", function () {
  const checkoutItems = document.getElementById("checkout-items");
  const totalPriceElem = document.getElementById("total-price");

  // --- Sab carts ka data lao ---
  const carts = [
    JSON.parse(localStorage.getItem("snacks_cart") || "[]"),
    JSON.parse(localStorage.getItem("brewed_cart") || "[]"),
    JSON.parse(localStorage.getItem("specialty_cart") || "[]"),
  ];

  // Combine all carts
  const allItems = carts.flat();

  let total = 0;

  allItems.forEach((item) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${itemTotal.toFixed(2)} PKR</td>
    `;
    checkoutItems.appendChild(tr);
  });

  totalPriceElem.textContent = `Total: ${total.toFixed(2)} PKR`;
});

// ================== Show payment details ==================
function showPaymentDetails(service) {
  const paymentDetails = document.getElementById("payment-details");
  const accountNumber = document.getElementById("account-number");

  if (service === "JazzCash") {
    accountNumber.textContent = "0300-1234567 (JazzCash)";
  } else if (service === "Easypaisa") {
    accountNumber.textContent = "0311-7654321 (Easypaisa)";
  }

  paymentDetails.style.display = "block";
}

// ================== Handle checkout form submission ==================
document.getElementById("checkoutForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Collect form data
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment").value;

  let onlinePayment = null;
  if (payment === "Online Payment") {
    const service = document.querySelector('input[name="service"]:checked');
    if (service) {
      onlinePayment = service.value;
    }
  }

  // Collect cart data
  const carts = [
    JSON.parse(localStorage.getItem("snacks_cart") || "[]"),
    JSON.parse(localStorage.getItem("brewed_cart") || "[]"),
    JSON.parse(localStorage.getItem("specialty_cart") || "[]"),
  ];
  const allItems = carts.flat();

  const messageDiv = document.getElementById("message");

  try {
    // Send request to backend with cart data
    const response = await fetch("http://localhost:5000/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        address,
        payment,
        onlinePayment,
        cart: allItems,
      }),
    });

    const result = await response.json();

    if (result.success) {
      messageDiv.innerHTML = "✅ Order placed successfully!";
      messageDiv.style.color = "green";

      // Clear all carts
      localStorage.removeItem("snacks_cart");
      localStorage.removeItem("brewed_cart");
      localStorage.removeItem("specialty_cart");

      // Reset form
      document.getElementById("checkoutForm").reset();
      document.getElementById("online-options").style.display = "none";
      document.getElementById("payment-details").style.display = "none";

      // Clear checkout table
      document.getElementById("checkout-items").innerHTML = "";
      document.getElementById("total-price").textContent = "Total: 0 PKR";
    } else {
      messageDiv.innerHTML = "❌ Failed to place order. Try again!";
      messageDiv.style.color = "red";
    }
  } catch (err) {
    console.error("Error:", err);
    messageDiv.innerHTML = "⚠️ Server error. Please try later!";
    messageDiv.style.color = "orange";
  }
});
