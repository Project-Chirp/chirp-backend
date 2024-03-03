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
    const { userId, username } = req.query;
    const query = await pool.query(profileQueries.getProfileContents, [
      userId,
      username,
    ]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getFollowStatus = async (req, res) => {
  try {
    const { userId, username } = req.query;
    const query = await pool.query(profileQueries.getFollowStatus, [
      userId,
      username,
    ]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const followUser = async (req, res) => {
  try {
    const { userId, username } = req.body;
    const query = await pool.query(profileQueries.followUser, [
      userId,
      username,
    ]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { userId, username } = req.body;
    const query = await pool.query(profileQueries.unfollowUser, [
      userId,
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
  getFollowStatus,
  followUser,
  unfollowUser,
};
