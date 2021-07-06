const express = require("express");
const compression = require("compression");
const serveStatic = require("express-static-gzip");
const path = require("path");
var history = require("connect-history-api-fallback");

const app = express();

app.use(compression());
app.use(history());
//here we are configuring dist to serve app files
app.use(
  "/",
  serveStatic(path.join(__dirname, "/dist"), {
    enableBrotli: true,
  })
);

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port);
