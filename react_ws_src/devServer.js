var path = require("path");
var express = require("express");
var webpack = require("webpack");
var config = require("./webpack.config.dev");
var https = require("https");
var http = require("http");
var app = express();
var compiler = webpack(config);

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

app.get("/api/heroes", function (req, response) {
  const url = `https://superheroapi.com/api/b92ed65f80c0c3c68c94adb1d5e347ac/search/${req.query.search}`;
  console.log("Received POST request for /api/heroes", url);
  https
    .get(url, (res) => {
      let body = "";
      // The 'data' event is emitted when a chunk of data is received
      res.on("data", (chunk) => {
        body += chunk;
      });

      // The 'end' event is emitted when the entire response has been received
      res.on("end", () => {
        try {
          // Parse the complete body string into a JavaScript object
          console.log("Response body:", body);
          const dataObject = JSON.parse(body);
          response.json(dataObject);
          // Now you can work with the dataObject
        } catch (error) {
          // console.error("Error parsing JSON:", error.message);
          response.status(500).json({ error: "Error parsing JSON" });
        }
      });
    })
    .on("error", (error) => {
      console.error("Error with the request:", error.message);
      response.status(500).json({ error: "Error with the request" });
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
