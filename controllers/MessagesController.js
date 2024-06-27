const pool = require("../database/db");
const messageQueries = require("../models/MessagesModel");

const addMessage = async (req, res) => {
  try {
    const { userId: sentUserId } = req.user;
    const { receivedUserId, textContent } = req.body;
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

const getDirectMessage = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messageQuery = await pool.query(messageQueries.getDirectMessage, [
      userId1,
      userId2,
    ]);
    const userQuery = await pool.query(messageQueries.getOtherUser, [userId2]);
    res.send({ messages: messageQuery.rows, otherUser: userQuery.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getConversationList = async (req, res) => {
  try {
    const { userId } = req.user;
    const query = await pool.query(messageQueries.getConversationList, [
      userId,
    ]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getModalConversations = async (req, res) => {
  try {
    const { userId } = req.user;
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
  getDirectMessage,
  getConversationList,
  getModalConversations,
  getFollowedList,
};
