const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const auth = require("./routes/auth");
const index = require("./routes/index");
app.use("/", auth);
app.use("/index", index);
app.use("/about", require("./routes/about"));
app.use("/classes", require("./routes/classes"));
app.use("/students", require("./routes/students"));
app.use("/performance", require("./routes/performance"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
