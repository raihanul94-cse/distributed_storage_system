const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
dotenv.config();

global.__basedir = __dirname;

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

require("./config/database")();

const apiRoutes = require("./routes");
app.use("/api/v1", apiRoutes);

module.exports = app;
