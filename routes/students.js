const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const dataPath = path.join(__dirname, "../data/students.json");

router.get("/", (req, res) => {
  const students = JSON.parse(fs.readFileSync(dataPath));
  res.render("students", { students });
});

router.post("/add", (req, res) => {
  const { id, name, address, marks } = req.body;
  let students = JSON.parse(fs.readFileSync(dataPath));
  students.push({ id, name, address, marks });
  fs.writeFileSync(dataPath, JSON.stringify(students));
  res.redirect("/students");
});

router.post("/delete", (req, res) => {
  const idtodelete = req.body.id;
  let students = JSON.parse(fs.readFileSync(dataPath));
  let index = students.findIndex((student) => student.id === idtodelete);
  if (index !== -1) {
    students.splice(index, 1);
  }
  fs.writeFileSync(dataPath, JSON.stringify(students));
  res.redirect("/students");
});

module.exports = router;
