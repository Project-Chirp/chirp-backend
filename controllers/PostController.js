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
    console.log(req.body);
    const { text_content } = req.body;
    console.log(text_content);
    const now = new Date();
    const newPost = await pool.query(
      `INSERT INTO post (user_id, post_timestamp, text_content, is_repost, is_quote_post, is_reply) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [1, now, text_content, false, false, false]
    );
    console.log(newPost.rows);
  } catch (err) {
    console.log(err);
  }
  res.status(201).send("Post added");
};

module.exports = {
  getPosts,
  addPost,
};
