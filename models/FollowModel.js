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
    u."displayName", 
    u."username"
  FROM app_user u
  JOIN follow f
    ON u."userId" = f. "followerUserId"
  WHERE f."followedUserId" = $1;
`;

const getFollowingUserList = `
  SELECT 
    u."userId", 
    u."displayName", 
    u."username"
  FROM app_user u
  JOIN follow f
    ON u."userId" = f."followedUserId"
  WHERE f."followerUserId" = $1;
`;

module.exports = {
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowersUserList,
  getFollowingUserList,
};
