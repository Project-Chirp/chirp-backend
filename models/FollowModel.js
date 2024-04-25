const followUser = `INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
SELECT $1, "userId", CURRENT_DATE, TRUE
FROM app_user
WHERE "userId" = $2
ON CONFLICT ("followerUserId", "followedUserId")
DO UPDATE SET "followStatus" = TRUE, "followedDate" = CURRENT_DATE
RETURNING *;
`;

const unfollowUser = `WITH otherUser AS (
SELECT "userId"
FROM app_user
WHERE "userId" = $2
LIMIT 1
)
UPDATE follow
SET "followStatus" = FALSE
WHERE "followerUserId" = $1
AND "followedUserId" = (SELECT "userId" FROM otherUser)
RETURNING *`;

const getFollowStatus = `SELECT 
"followStatus"
FROM follow
WHERE "followerUserId" = $1
AND "followedUserId" = (SELECT "userId" FROM app_user WHERE "userId" = $2);`;

module.exports = {
  followUser,
  unfollowUser,
  getFollowStatus,
};
