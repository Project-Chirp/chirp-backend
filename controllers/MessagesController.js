const pool = require("../database/db");
const messageQueries = require("../models/MessagesModel");

const getLatestMessages = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(messageQueries.getLatestMessages, [userId]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getLatestMessages,
};
