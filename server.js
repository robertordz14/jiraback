const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

require("./config/db");
require("colors");

app.set("port", process.env.PORT || 5000);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(bodyParser.json());

app.use("/api", require("./controllers/index"));

app.listen(app.get("port"), () => {
  console.log("[SERVER]".green, `Se ejecuta en el puerto ${app.get("port")}`);
});
