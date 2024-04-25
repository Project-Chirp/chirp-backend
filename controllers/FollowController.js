const pool = require("../database/db");
const followQueries = require("../models/FollowModel");

const followUser = async (req, res) => {
  try {
    const { currentUserId, visitedUsername } = req.body;
    const query = await pool.query(followQueries.followUser, [
      currentUserId,
      visitedUsername,
    ]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { currentUserId, visitedUsername } = req.body;
    const query = await pool.query(followQueries.unfollowUser, [
      currentUserId,
      visitedUsername,
    ]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getFollowStatus = async (req, res) => {
  try {
    const { currentUserId, visitedUsername } = req.body;
    if ((currentUserId || visitedUsername) === undefined)
      throw new Error("currentUserId or visitedUsername is undefined");
    const query = await pool.query(followQueries.getFollowStatus, [
      currentUserId,
      visitedUsername,
    ]);
    res.send(query.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowStatus,
};
