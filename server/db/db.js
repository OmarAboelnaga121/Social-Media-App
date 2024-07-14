const mongoose = require("mongoose");

require('dotenv').config();

mongoose.connect(process.env.DbConnectionString);

const DB = mongoose.connection;

DB.on("error", (err) => {
    console.log("error in database ==>", err);
})

DB.once("open", () => {
    console.log("connected to database");
})
