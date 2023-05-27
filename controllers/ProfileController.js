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
const getTweetCount = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(profileQueries.getTweetCount, [userId]);
    res.send(query.rows[0].count);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getBio = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(profileQueries.getBio, [userId]);
    res.send(query.rows[0].Bio);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getJoinDate = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(profileQueries.getJoinDate, [userId]);
    const date = new Date(query.rows[0].joinedDate);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const formattedDate = `${month} ${year}`;
    res.send(formattedDate);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  getOwnTweets,
  getOwnReplies,
  getOwnLikes,
  getTweetCount,
  getBio,
  getJoinDate,
};
