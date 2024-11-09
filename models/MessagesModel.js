const addMessage = `
  INSERT INTO message (timestamp, "textContent", "sentUserId", "receivedUserId") VALUES 
    ($1, $2, $3, $4)
  RETURNING *;
`;

const getDirectMessage = `
  SELECT *
  FROM message
  WHERE "sentUserId" in ($1, $2) 
    AND "receivedUserId" in ($1, $2)
  ORDER BY timestamp;
`;

const getConversationList = `
  SELECT DISTINCT ON("otherUserId")
    "displayName",
    username,
    "textContent",
    timestamp,
    s."otherUserId"
  FROM (
    SELECT m.*,
      CASE
        WHEN "sentUserId" = $1 
        THEN "receivedUserId" 
        ELSE "sentUserId" 
      END AS "otherUserId"
    FROM message m
    WHERE m."sentUserId" = $1
      OR m."receivedUserId" = $1
  ) AS s
  INNER JOIN app_user u 
    ON s."otherUserId" = u."userId"
  ORDER BY "otherUserId", timestamp DESC;
`;

const getOtherUser = `
  SELECT
    username,
    "displayName",
    "bio",
    "joinedDate",
    (
      SELECT
        COUNT(*)
      FROM follow
      WHERE "followedUserId" = u."userId"
    ) AS "followerCount"
  FROM app_user as u
  WHERE "userId" = $1;
`;

const getFollowedList = `
  SELECT 
    u."userId", 
    u."displayName", 
    u."username"
  FROM app_user u
  INNER JOIN follow f
    ON u."userId" = f."followedUserId"
  WHERE f."followerUserId" = $1;
`;

module.exports = {
  addMessage,
  getDirectMessage,
  getConversationList,
  getFollowedList,
  getOtherUser,
};
