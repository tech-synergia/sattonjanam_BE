const express = require("express");
require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const connectDb = require("./db");
const PORT = process.env.PORT;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: "https://www.sattonjanam.com", credentials: true }));

app.use(`/api/v1/`, require("./route/authRoute"));
app.use(`/api/v1/image/`, require("./route/imageRouter"));
app.use(`/api/v1/query`, require("./route/queryRouter"));
app.use(`/api/v1/connectus`, require("./route/connectusRoute"));

app.all("*", (req, res, next) => {
  res.status(404).json({ msg: `requested path not found, try '/api/v1/'` });
  next();
});

app.listen(PORT, async () => {
  await connectDb(process.env.MONGO_URL);
  console.log("Connected to MongoDB...");
  console.log(`server is started @ http://localhost:${PORT}`);
});
