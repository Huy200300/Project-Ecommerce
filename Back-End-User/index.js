const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./configDB/db");
const router = require("./router");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080 || process.env.PORT;
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`server is running on port ` + PORT);
});
