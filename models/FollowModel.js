const followUser = `INSERT INTO follow ("followerUserId", "followedUserId")
VALUES ($1, $2)`;

const unfollowUser = `DELETE FROM follow
WHERE "followerUserId" = $1
AND "followedUserId" = $2;`;

const getFollowStatus = `SELECT EXISTS (
  SELECT 1
  FROM follow
  WHERE "followerUserId" = $1 AND "followedUserId" = $2
) as "followStatus";`;

module.exports = {
  followUser,
  unfollowUser,
  getFollowStatus,
};
