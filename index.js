"use strict";
const express = require("express");
const app = express();
const port = process.env.PORT || 1234;
const join = require("path").join;
const cors = require("cors");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static(join(__dirname, "public")));
app.use(require("./routes/twitter"));
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
