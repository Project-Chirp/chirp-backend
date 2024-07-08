const followUser = `
  INSERT INTO follow ("followerUserId", "followedUserId") VALUES 
    ($1, $2);
`;

const unfollowUser = `
  DELETE FROM follow
  WHERE "followerUserId" = $1
    AND "followedUserId" = $2;
`;

const getFollowStatus = `
  SELECT EXISTS (
    SELECT 1
    FROM follow
    WHERE "followerUserId" = $1 AND "followedUserId" = $2
  ) as "followStatus";
`;

const getFollowersUserList = `
  SELECT 
    u."userId", 
    u."username", 
    u."displayName", 
    CASE WHEN f2."followerUserId" IS NOT NULL THEN TRUE ELSE FALSE END AS "isFollowing"
  FROM app_user u
  JOIN follow f ON u."userId" = f."followerUserId"
  LEFT JOIN follow f2 ON u."userId" = f2."followedUserId" AND f2."followerUserId" = $2
  WHERE f."followedUserId" = $1;
`;

const getFollowingUserList = `
  SELECT
    u."userId",
    u."username",
    u."displayName",
    CASE WHEN f2."followerUserId" IS NOT NULL THEN TRUE ELSE FALSE END AS "isFollowing"
  FROM app_user u
  JOIN follow f ON u."userId" = f."followedUserId"
  LEFT JOIN follow f2 ON u."userId" = f2."followedUserId" AND f2."followerUserId" = $2
  WHERE f."followerUserId" = $1;
`;

module.exports = {
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowersUserList,
  getFollowingUserList,
};
