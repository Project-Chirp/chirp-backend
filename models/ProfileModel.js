const getOwnTweets = `WITH post_likes AS (
    SELECT "postId", 
      COUNT(*)::INT AS "numberOfLikes"
    FROM liked_post
    GROUP BY "postId"
    )
    SELECT p."postId",
     u.username,
     u."displayName",
     p."textContent",
     p.timestamp,
     EXISTS(SELECT 1 FROM liked_post li WHERE li."userId" = $1 AND li."postId" = p."postId" LIMIT 1) AS "isLikedByCurrentUser",
     COALESCE(l."numberOfLikes",0) AS "numberOfLikes"
     FROM post AS p
     LEFT JOIN post_likes AS l ON p."postId" = l."postId"
     INNER JOIN app_user AS u ON p."userId" = u."userId"
     WHERE u."userId" = $1 AND p."isReply" = 'false'
     ORDER BY p.timestamp DESC`;

const getOwnReplies = `WITH post_likes AS (
  SELECT "postId", 
	COUNT(*)::INT AS "numberOfLikes"
  FROM liked_post
  GROUP BY "postId"
  )
  SELECT p."postId",
   u.username,
   u."displayName",
   p."textContent",
   p.timestamp,
   EXISTS(SELECT 1 FROM liked_post li WHERE li."userId" = $1 AND li."postId" = p."postId" LIMIT 1) AS "isLikedByCurrentUser",
   COALESCE(l."numberOfLikes",0) AS "numberOfLikes"
   FROM post AS p
   LEFT JOIN post_likes AS l ON p."postId" = l."postId"
   INNER JOIN app_user AS u ON p."userId" = u."userId"
   WHERE u."userId" = $1 AND p."isReply" = 'true'
   ORDER BY p.timestamp DESC`;

const getOwnLikes = `WITH post_likes AS (
  SELECT "postId", 
    COUNT(*)::INT AS "numberOfLikes"
  FROM liked_post
  GROUP BY "postId"
)
SELECT p."postId",
  u.username,
  u."displayName",
  p."textContent",
  p.timestamp,
  EXISTS(SELECT 1 FROM liked_post li WHERE li."userId" = $1 AND li."postId" = p."postId" LIMIT 1) AS "isLikedByCurrentUser",
  COALESCE(l."numberOfLikes", 0) AS "numberOfLikes"
FROM post AS p
LEFT JOIN post_likes AS l ON p."postId" = l."postId"
INNER JOIN app_user AS u ON p."userId" = u."userId"
AND EXISTS(SELECT 1 FROM liked_post li WHERE li."userId" = $1 AND li."postId" = p."postId" LIMIT 1)
ORDER BY p.timestamp DESC;`;

const getTweetCount = `SELECT COUNT(*) FROM post AS p WHERE p."userId" = $1`;

const getBio = `SELECT a."Bio"
FROM app_user AS a
WHERE a."userId" = $1;`;

const getJoinDate = `SELECT a."joinedDate" 
FROM app_user AS a 
WHERE a."userId" = $1`;

module.exports = {
  getOwnTweets,
  getOwnReplies,
  getOwnLikes,
  getTweetCount,
  getBio,
  getJoinDate,
};
