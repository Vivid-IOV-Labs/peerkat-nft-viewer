/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const compression = require("compression");
const serveStatic = require("express-static-gzip");
const path = require("path");

const app = express();

app.use(compression());
//here we are configuring dist to serve app files
app.use("/", serveStatic(path.join(__dirname, "/dist")));

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port);
