const pool = require("../database/db");
const messageQueries = require("../models/MessagesModel");

const getLatestMessages = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(messageQueries.getLatestMessages, [userId]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getDMList = async (req, res) => {
  try {
    const { userId } = req.query;

    const query = await pool.query(messageQueries.getDMList, [userId]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getFollowedList = async (req, res) => {
  try {
    const { userId } = req.query;

    const query = await pool.query(messageQueries.getFollowedList, [userId]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  getLatestMessages,
  getDMList,
  getFollowedList,
};
