const getLatestMessages = `SELECT DISTINCT ON(otherUserId)
  "displayName",
  username,
  "textContent",
  timestamp
  FROM
    (SELECT m.*,
     CASE WHEN "sentUserId" = $1 THEN "receivedUserId" ELSE "sentUserId" END AS otherUserId
    FROM message m
    WHERE m."sentUserId" = $1 OR m."receivedUserId" = $1) s
  JOIN app_user u ON s.otherUserId = u."userId"
  ORDER BY otherUserId, timestamp DESC;`;

const getDMList = `SELECT DISTINCT ON("otherUserId")
"otherUserId",
"displayName",
username
FROM
  (SELECT m.*,
   CASE WHEN "sentUserId" = $1 THEN "receivedUserId" ELSE "sentUserId" END AS "otherUserId"
  FROM message m
  WHERE m."sentUserId" = $1 OR m."receivedUserId" = $1) s
JOIN app_user u ON s."otherUserId" = u."userId"
ORDER BY "otherUserId", timestamp DESC;`;

const getFollowedList = `SELECT u."userId" AS "otherUserId", u."displayName", u."username"
FROM app_user u
JOIN follow f ON u."userId" = f."followedUserId"
WHERE f."followerUserId" = $1 AND f."followStatus" = true;`;

module.exports = {
  getLatestMessages,
  getDMList,
  getFollowedList,
};
