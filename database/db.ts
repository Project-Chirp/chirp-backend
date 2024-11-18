const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "twitter_clone",
  // Create a file called .env and create a variable with your password inside it (ie. DB_PASSWORD = "yourpassword")
  password: process.env.DB_PASSWORD,
  port: "5432",
});

module.exports = pool;
