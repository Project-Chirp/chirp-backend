const pool = require("../database/db");
const profileQueries = require("../models/ProfileModel");

const getUserPosts = async (req, res) => {
  try {
    const { userId, offset } = req.query;
    const query = await pool.query(profileQueries.getUserPosts, [
      userId,
      offset,
    ]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getUserReplies = async (req, res) => {
  try {
    const { userId, offset } = req.query;
    const query = await pool.query(profileQueries.getUserReplies, [
      userId,
      offset,
    ]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getUserLikes = async (req, res) => {
  try {
    const { userId, offset } = req.query;
    const query = await pool.query(profileQueries.getUserLikes, [
      userId,
      offset,
    ]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getProfileContents = async (req, res) => {
  try {
    const { currentUserId, visitedUsername } = req.query;
    const query = await pool.query(profileQueries.getProfileContents, [
      currentUserId,
      visitedUsername,
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
