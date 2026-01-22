var path = require("path");
var express = require("express");
var webpack = require("webpack");
var config = require("./webpack.config.dev");
var https = require("https");
var http = require("http");
var app = express();
var compiler = webpack(config);
const zlib = require("node:zlib");
const fs = require("node:fs");
// const { fetch } = require("./fetch.mjs");

const { DecompressionStream } = require("node:stream/web");

async function convertToText(gzipBlob) {
  const ds = new DecompressionStream("gzip");
  const decompressedStream = gzipBlob.stream().pipeThrough(ds);

  // Use a Response object for easy text conversion
  const response = new Response(decompressedStream);
  const text = await response.text();
  return text;
}

app.use(
  require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }),
);

app.use(require("webpack-hot-middleware")(compiler));

// app.use(express.static(paths.client('images')))
// app.use(express.static('static'))

var proxy = require("proxy-middleware");
var url = require("url");
// app.use('/images', proxy(url.parse('../WS/images')));
// app.use('/img', proxy(url.parse('../WS/img')));
app.use(
  "/images",
  proxy(url.parse("http://z2/projs/kisla/X-react-starter/dev/WS/images")),
);

app.get("/api/heroes-mock", function (req, response) {
  const { search } = req.query;
  // console.log(req);
  const map = {
    superman: true,
    batman: true,
    spiderman: true,
  };
  console.log("Received request for /api/heroes-mock", search);
  if (map[search]) {
    response.sendFile(path.join(__dirname, `/mockData/${search}.json`));
    return;
  }
  response.status(404).json({ error: "Hero not found in mock data" });
});

app.get("/api/heroes", async function (req, response) {
  const url = `https://superheroapi.com/api/b92ed65f80c0c3c68c94adb1d5e347ac/search/${req.query.search}`;
  console.log("Received POST request for /api/heroes", url);
  const fetch = (await import("node-fetch")).default;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      response.json(data);
    })
    .catch((err) => {
      console.error("Error fetching hero data:", err);
      response.status(500).json({ error: "Error fetching hero data" });
    });
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

app.listen(3000, "0.0.0.0", function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Listening at http://0.0.0.0:3000");
});
