const addMessage = `INSERT INTO message (timestamp, "textContent", "sentUserId", "receivedUserId") VALUES ($1, $2, $3, $4)
  RETURNING *;`;

const getDirectMessage = `SELECT * FROM message
  WHERE "sentUserId" in ($1, $2) AND "receivedUserId" in ($1, $2)
  ORDER BY timestamp`;

const getLatestMessages = `SELECT DISTINCT ON("otherUserId")
  "displayName",
  username,
  "textContent",
  timestamp,
  s."otherUserId"
  FROM
    (SELECT m.*,
     CASE WHEN "sentUserId" = $1 THEN "receivedUserId" ELSE "sentUserId" END AS "otherUserId"
    FROM message m
    WHERE m."sentUserId" = $1 OR m."receivedUserId" = $1) s
  JOIN app_user u ON s."otherUserId" = u."userId"
  ORDER BY "otherUserId", timestamp DESC;`;

module.exports = {
  addMessage,
  getDirectMessage,
  getLatestMessages,
};
