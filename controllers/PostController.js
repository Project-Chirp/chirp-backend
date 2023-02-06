const pool = require("../database/db");
const postQueries = require("../Models/PostModel");

const getPosts = (req, res) => {
  pool.query(postQueries.getAllPosts, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

module.exports = {
  getPosts,
};
