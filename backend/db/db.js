const mongoose = require("mongoose");
const dotenv = require("dotenv");
function connectToDB() {
  mongoose
    .connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    })
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.log("Error connecting to the database");
      console.log(err);
    });
}

module.exports = connectToDB;
