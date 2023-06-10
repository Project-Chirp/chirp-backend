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

const getDirectMessage = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const query = await pool.query(messageQueries.getDirectMessage, [
      userId1,
      userId2,
    ]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  getDirectMessage,
  getLatestMessages,
};
