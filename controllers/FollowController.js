const pool = require("../database/db");
const followQueries = require("../models/FollowModel");

const followUser = async (req, res) => {
  try {
    const { currentUserId, visitedUserId } = req.body;
    const query = await pool.query(followQueries.followUser, [
      currentUserId,
      visitedUserId,
    ]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { currentUserId, visitedUserId } = req.body;
    const query = await pool.query(followQueries.unfollowUser, [
      currentUserId,
      visitedUserId,
    ]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getFollowStatus = async (req, res) => {
  try {
    const { currentUserId, visitedUserId } = req.body;
    const query = await pool.query(followQueries.getFollowStatus, [
      currentUserId,
      visitedUserId,
    ]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getFollowersList = async (req, res) => {
  try {
    const { visitedUserId, currentUserId } = req.query;
    const query = await pool.query(followQueries.getFollowersList, [
      visitedUserId,
      currentUserId,
    ]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getFollowingList = async (req, res) => {
  try {
    const { visitedUserId, currentUserId } = req.query;
    const query = await pool.query(followQueries.getFollowingList, [
      visitedUserId,
      currentUserId,
    ]);
    res.send(query.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowersList,
  getFollowingList,
};
