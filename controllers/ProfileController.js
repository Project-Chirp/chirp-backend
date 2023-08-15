const pool = require("../database/db");
const profileQueries = require("../models/ProfileModel");

const getOwnTweets = async (req, res) => {
  try {
    const { username } = req.query;
    const query = await pool.query(profileQueries.getOwnTweets, [username]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getOwnReplies = async (req, res) => {
  try {
    const { username } = req.query;
    const query = await pool.query(profileQueries.getOwnReplies, [username]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getOwnLikes = async (req, res) => {
  try {
    const { username } = req.query;
    const query = await pool.query(profileQueries.getOwnLikes, [username]);
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
  getOwnTweets,
  getOwnReplies,
  getOwnLikes,
  getProfileContents,
};
