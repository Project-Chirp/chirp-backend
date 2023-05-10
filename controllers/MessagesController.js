const pool = require("../database/db");
const messageQueries = require("../models/MessagesModel");

const getLatestMessages = (req, res) => {
  pool.query(messageQueries.getLatestMessages, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

module.exports = {
  getLatestMessages,
};
