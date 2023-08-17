const pool = require("../database/db");
const profileQueries = require("../models/ProfileModel");

const getUserPosts = async (req, res) => {
  try {
    const { username } = req.query;
    const query = await pool.query(profileQueries.getUserPosts, [username]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getUserReplies = async (req, res) => {
  try {
    const { username } = req.query;
    const query = await pool.query(profileQueries.getUserReplies, [username]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getUserLikes = async (req, res) => {
  try {
    const { username } = req.query;

    const query = await pool.query(profileQueries.getUserLikes, [username]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getProfileContents = async (req, res) => {
  try {
    const { username } = req.query;
    const query = await pool.query(profileQueries.getProfileContents, [
      username,
    ]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  getUserPosts,
  getUserReplies,
  getUserLikes,
  getProfileContents,
};
