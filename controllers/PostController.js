const pool = require("../database/db");
const postQueries = require("../Models/PostModel");

const getPosts = (req, res) => {
  pool.query(postQueries.getAllPosts, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addPost = async (req, res) => {
  try {
    const { text_content } = req.body;
    const now = new Date();
    pool.query(postQueries.addPost, [
      1,
      now,
      text_content,
      false,
      false,
      false,
    ]);
  } catch (err) {
    console.log(err);
  }
  res.status(201).send("Post added");
};

module.exports = {
  getPosts,
  addPost,
};
