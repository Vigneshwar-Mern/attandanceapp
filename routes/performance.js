const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const dataPath = path.join(__dirname, "../data/students.json");

router.get("/", (req, res) => {
  const students = JSON.parse(fs.readFileSync(dataPath));
  students.sort((a, b) => b.marks - a.marks);
  res.render("performance", { grades: students });
});

module.exports = router;
