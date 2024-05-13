const pool = require("../database/db");
const messageQueries = require("../models/MessagesModel");

const addMessage = async (req, res) => {
  try {
    const { sentUserId, receivedUserId, textContent } = req.body;
    const timestamp = new Date();
    const query = await pool.query(messageQueries.addMessage, [
      timestamp,
      textContent,
      sentUserId,
      receivedUserId,
    ]);
    res.status(201).send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getOtherUser = async (req, res) => {
  try {
    const { userId2 } = req.params;
    const userQuery = await pool.query(messageQueries.getOtherUser, [userId2]);
    res.send(userQuery.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getDirectMessage = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const { offset } = req.query;
    const messageQuery = await pool.query(messageQueries.getDirectMessage, [
      userId1,
      userId2,
      offset,
    ]);
    res.send(messageQuery.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getConversationList = async (req, res) => {
  try {
    const { userId, offset } = req.query;
    const query = await pool.query(messageQueries.getConversationList, [
      userId,
      offset,
    ]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getModalConversations = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = await pool.query(messageQueries.getConversationList, [
      userId,
    ]);
    const filteredQuery = query.rows.map(
      ({ otherUserId, displayName, username }) => ({
        userId: otherUserId,
        displayName,
        username,
      })
    );
    res.send(filteredQuery);
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
  addMessage,
  getOtherUser,
  getDirectMessage,
  getConversationList,
  getModalConversations,
  getFollowedList,
};
