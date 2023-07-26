const fs = require("fs");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const bookingRoute = require("./routes/booking");
const adminRoute = require("./routes/admin");
const errorController = require("./controllers/error");

const app = express();

const accessLogSteam = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined", { stream: accessLogSteam }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(bookingRoute);
app.use("/admin", adminRoute);
app.use(errorController.get404);

// App listen after mongo connected
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.abyljau.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));
