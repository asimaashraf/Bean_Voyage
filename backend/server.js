const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
//const open = (...args) => import("open").then((m) => m.default(...args)); 
require("dotenv").config(); // Browser open karne ke liye

const app = express();
const PORT = process.env.PORT || 5000;


// ================== Middlewares ==================
app.use(bodyParser.json());
app.use(cors());

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, "../")));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/Abouts", express.static(path.join(__dirname, "../Abouts")));
app.use("/Services", express.static(path.join(__dirname, "../Services")));
app.use("/Contacts", express.static(path.join(__dirname, "../Contacts")));
app.use("/Login", express.static(path.join(__dirname, "../Login")));

// ================== MongoDB Atlas Connection ==================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// ================== User Schema ==================
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

// ================== Contact Schema ==================
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);


// ================== Order Schema ==================
const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  payment: String,        // COD / Online
  onlinePayment: String,  // JazzCash / Easypaisa (agar selected ho)
  cart: Array,            // Cart ka pura data
  totalAmount: Number,    // Total price
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

// ================== Routes ==================

// ✅ Registration Route
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    // ✅ Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Registration Successful ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password ❌" });
    }

    res.json({ message: "Login Successful 🎉" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ✅ Contact Route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, address, message } = req.body;

    if (!name || !email || !address || !message) {
      return res.status(400).json({ message: "All fields are required ❌" });
    }

    const newContact = new Contact({ name, email, address, message });
    await newContact.save();

    res.status(201).json({ message: "Message saved successfully ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server Error ❌" });
  }
});

// ✅ Checkout Route
app.post("/checkout", async (req, res) => {
  try {
    const { name, email, address, payment, onlinePayment, cart } = req.body;

    // Total amount calculate karo
    let totalAmount = 0;
    if (Array.isArray(cart)) {
      cart.forEach(item => {
        totalAmount += item.price * item.qty;
      });
    }

    const order = new Order({
      name,
      email,
      address,
      payment,
      onlinePayment,
      cart,
      totalAmount
    });

    await order.save();

    res.json({ success: true, message: "✅ Order saved successfully!" });
  } catch (err) {
    console.error("Checkout Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/health", (req, res) => {
  res.send("OK");
});

// ================== Routes for Pages ==================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../Abouts/about.html"));
});

app.get("/services", (req, res) => {
  res.sendFile(path.join(__dirname, "../Services/service.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../Login/login.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "../Contacts/contact.html"));
});

app.get("/checkout", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/checkout.html"));
});


// ================== Start Server ==================
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}/`);
//  open(`http://localhost:${PORT}/`); // ✅ Direct root se index.html open hoga
});
