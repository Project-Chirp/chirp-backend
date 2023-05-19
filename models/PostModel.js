const addPost = `INSERT INTO post ("userId", timestamp, "textContent", "isRepost", "isQuotePost", "isReply") VALUES ($1, $2, $3, $4, $5, $6)
RETURNING "postId", "textContent", timestamp`;

const getAllPosts = `WITH post_likes AS (
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
   INNER JOIN app_user AS u ON p."userId" = u."userId"`;

const likePost = `INSERT INTO liked_post ("userId", "postId") VALUES ($1, $2)`;

const unlikePost = `DELETE FROM liked_post WHERE "userId" = $1 AND "postId" = $2`;

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
// Can remove the first exists and keep the 2nd and it works... why? Query works but like button is bugged, shows its unliked. If you have both exists it works though..?
// Timestamp descending/ascending. Should it be done?
module.exports = {
  addPost,
  getAllPosts,
  likePost,
  unlikePost,
  getOwnTweets,
  getOwnReplies,
  getOwnLikes,
  getTweetCount,
  getBio,
};
