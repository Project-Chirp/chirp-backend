const Pool = require('pg').Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "twitter_clone",
  password: "twitter",
  port: "5432"
});

module.exports = pool;  