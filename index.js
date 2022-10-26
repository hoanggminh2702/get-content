const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require("http");
const port = 8080;

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.post("/get-content", (req, res) => {
  const url = req.body.url ?? "";
  let data = "";

  if (url) {
    try {
      http.get(url, (resp) => {
        // A chunk of data has been received.
        resp.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          data.toString();
          return res.status(200).send(data);
        });
      });
    } catch (err) {
      https
        .get(url, (response) => {
          // A chunk of data has been received.
          response.on("data", (chunk) => {
            data += chunk;
          });

          // The whole response has been received. Print out the result.
          response.on("end", () => {
            data.toString();
            return res.status(200).send(data);
          });
        })
        .on("error", (err) => {
          return res.status(500).send(err);
        });
    }
  }
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
