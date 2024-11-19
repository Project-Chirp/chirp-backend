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
    ]);
    // TODO: Find a way to return the entire post object rather than appending missing attributes in the frontend
    res.status(201).send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const addReply = async (req, res) => {
  try {
    const { userId, parentPostId, textContent } = req.body;
    const timestamp = new Date();
    const query = await pool.query(postQueries.addReply, [
      userId,
      parentPostId,
      timestamp,
      textContent,
      false,
      false,
    ]);
    // TODO: Find a way to return the entire post object rather than appending missing attributes in the frontend
    res.status(201).send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
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

const getReplies = async (req, res) => {
  try {
    const { userId, postId } = req.query;
    const query = await pool.query(postQueries.getReplies, [userId, postId]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getPost = async (req, res) => {
  try {
    const { userId, postId } = req.query;
    const query = await pool.query(postQueries.getPost, [userId, postId]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const query = await pool.query(postQueries.deletePost, [postId]);
    res.send(query.rows[0]);
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

const addRepost = async (req, res) => {
  try {
    const { userId, parentPostId } = req.body;
    const timestamp = new Date();
    const query = await pool.query(postQueries.addRepost, [
      userId,
      parentPostId,
      timestamp,
      true,
      false,
    ]);
    // TODO: Find a way to return the entire post object rather than appending missing attributes in the frontend
    res.status(201).send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const deleteRepost = async (req, res) => {
  try {
    const { userId, parentPostId } = req.query;
    console.log(userId);
    const query = await pool.query(postQueries.deleteRepost, [
      userId,
      parentPostId,
    ]);
    // TODO: Find a way to return the entire post object rather than appending missing attributes in the frontend
    res.status(201).send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const editPost = async (req, res) => {
  try {
    const editedTimestamp = new Date();
    const { postId, textContent } = req.body;

    if (!postId || !textContent) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await pool.query(postQueries.editPost, [
      postId,
      textContent,
      editedTimestamp,
    ]);
    res.sendStatus(200);
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
  getPost,
  getReplies,
  addReply,
  deletePost,
  editPost,
  addRepost,
  deleteRepost,
};
