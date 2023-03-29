const pool = require("../database/db");
const postQueries = require("../Models/PostModel");

const getPosts = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(postQueries.getAllPosts2, [userId]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const likePost = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    console.log("ADD");
    await pool.query(
      `INSERT INTO liked_post ("userId", "postId") VALUES ($1, $2)`,
      [userId, postId]
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const unlikePost = async (req, res) => {
  try {
    const { postId, userId } = req.query;
    console.log("DELETE");
    await pool.query(
      `DELETE FROM liked_post WHERE "userId" = $1 AND "postId" = $2`,
      [userId, postId]
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// const getPosts = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     let query = await pool.query(postQueries.getAllPosts);
//     const postInfo = query.rows;
//     query = await pool.query(
//       `SELECT COUNT(*) FROM liked_post WHERE "userId" = $1`,
//       [userId]
//     );
//     const likes = query.rows[0].count;
//     console.log(postInfo);
//     res.send("TEST");
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// };

const addPost = async (req, res) => {
  try {
    const { userId, textContent } = req.body;
    const timestamp = new Date();
    pool.query(postQueries.addPost, [
      userId,
      timestamp,
      textContent,
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
  likePost,
  unlikePost,
};
