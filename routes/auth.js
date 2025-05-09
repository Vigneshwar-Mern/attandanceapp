const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();

const users = [];

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const existUser = users.find(
    (u) => u.username === username || u.email === email
  );
  console.log("Existing user check:", existUser);

  if (existUser) {
    return res.status(400).send("User already exists. Please login.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ username, email, password: hashedPassword });
  console.log("User registered:", username);

  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username || u.email === username
  );
  console.log("User login attempt:", user);

  if (!user) {
    return res.status(404).send("User not found. Please register first.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send("Incorrect password.");
  }

  const token = jwt.sign(
    { username: user.username, email: user.email },
    SECRET_KEY
  );

  res.cookie("token", token);
  console.log("Generated token:", token);

  res.redirect("/dashboard");
});

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  console.log("Auth token:", token);

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("token");
    res.redirect("/login");
  }
}

router.get("/dashboard", authenticateToken, (req, res) => {
  res.render("dashboard", { username: req.user.username });
});

router.get("/Continue", (req, res) => {
  res.redirect("/index");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  console.log("User logged out");

  res.redirect("/login");
});

module.exports = router;
