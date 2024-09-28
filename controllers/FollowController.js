const pool = require("../database/db");
const followQueries = require("../models/FollowModel");

const followUser = async (req, res) => {
  try {
    const { userId: currentUserId } = req.user;
    const { visitedUserId } = req.body;
    if (currentUserId === visitedUserId) {
      throw new Error("A user cannot follow themselves");
    }
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
    const { userId: currentUserId } = req.user;
    const { visitedUserId } = req.body;
    if (currentUserId === visitedUserId) {
      throw new Error("A user cannot unfollow themselves");
    }
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

const getFollowerList = async (req, res) => {
  try {
    const { visitedUserId, currentUserId } = req.query;
    const query = await pool.query(followQueries.getFollowerList, [
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
  getFollowerList,
  getFollowingList,
};
