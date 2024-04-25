const followUser = `INSERT INTO follow ("followerUserId", "followedUserId")
SELECT $1, "userId"
FROM app_user
WHERE "userId" = $2;
`;

const unfollowUser = `DELETE FROM follow
WHERE "followerUserId" = $1
AND "followedUserId" = $2;
`;

const getFollowStatus = `SELECT EXISTS (
  SELECT 1 
  FROM follow 
  WHERE "followerUserId" = $1 
  AND "followedUserId" = (SELECT "userId" FROM app_user WHERE "userId" = $2)
) AS "followStatus";
`;

module.exports = {
  followUser,
  unfollowUser,
  getFollowStatus,
};
