const pool = require("../database/db");
const postQueries = require("../models/PostModel");

const addPost = async (req, res) => {
  try {
    const { userId, textContent } = req.body;
    const timestamp = new Date();
    const query = await pool.query(postQueries.addPost, [
      userId,
      timestamp,
      textContent,
      false,
      false,
      false,
    ]);
    // TODO: Find a way to return the entire post object rather than appending missing attributes in the frontend
    res.status(201).send(query.rows[0]);
  } catch (err) {
    console.log(err);
  }
};

const getPosts = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(postQueries.getAllPosts, [userId]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const likePost = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    await pool.query(postQueries.likePost, [userId, postId]);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const unlikePost = async (req, res) => {
  try {
    const { postId, userId } = req.query;
    await pool.query(postQueries.unlikePost, [userId, postId]);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getOwnTweets = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(postQueries.getOwnTweets, [userId]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
module.exports = {
  addPost,
  getPosts,
  likePost,
  unlikePost,
  getOwnTweets,
};
