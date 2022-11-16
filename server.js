const express = require("express");
const jsonData = require("./16-11-22.json");
const app = express();

app.get("/", (req, res) => {
  res.json({ jsonData });
});
app.listen(4000, () => {
  console.log("Server listening on port 4000");
});
