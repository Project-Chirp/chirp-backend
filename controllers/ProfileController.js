const pool = require("../database/db");
const profileQueries = require("../models/ProfileModel");

const getOwnTweets = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(profileQueries.getOwnTweets, [userId]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getOwnReplies = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(profileQueries.getOwnReplies, [userId]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getOwnLikes = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(profileQueries.getOwnLikes, [userId]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getProfileContents = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(profileQueries.getProfileContents, [userId]);
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
