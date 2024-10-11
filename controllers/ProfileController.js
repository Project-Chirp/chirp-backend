const pool = require("../database/db");
const profileQueries = require("../models/ProfileModel");

const editProfile = async (req, res) => {
  try {
    const { displayName, birthDate, bio, userId } = req.body;
    const query = await pool.query(profileQueries.editProfile, [
      displayName,
      birthDate,
      bio,
      userId,
    ]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { visitedUserId } = req.query;
    console.log(visitedUserId);
    const query = await pool.query(profileQueries.getUserPosts, [
      visitedUserId,
    ]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getUserReplies = async (req, res) => {
  try {
    const { visitedUserId } = req.query;
    const query = await pool.query(profileQueries.getUserReplies, [
      visitedUserId,
    ]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getUserLikes = async (req, res) => {
  try {
    const { visitedUserId } = req.query;
    const query = await pool.query(profileQueries.getUserLikes, [
      visitedUserId,
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
  editProfile,
  getUserPosts,
  getUserReplies,
  getUserLikes,
  getProfileContents,
};
