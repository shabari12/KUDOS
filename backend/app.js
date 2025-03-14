const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDB = require("./db/db");
const userRoutes = require("./routes/userRoutes");
const spaceRoutes = require("./routes/spaceRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

/* const corsOptions = {
  origin: ["https://kudos-webapp.vercel.app", "http://localhost:5173"],
  credentials: true,
}; */
app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRoutes);
app.use("/spaces", spaceRoutes);
app.use("/feedback", feedbackRoutes);

module.exports = app;
