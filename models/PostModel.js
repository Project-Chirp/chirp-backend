const getAllPosts = `SELECT u.username,
   u."displayName",
   p."textContent",
   p.timestamp
   FROM post AS p
   INNER JOIN app_user AS u ON p."userId" = u."userId"`;

const getAllPosts2 = `WITH post_likes AS (
  SELECT "postId", 
	COUNT(*) AS "numberOfLikes"
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

const addPost = `INSERT INTO post ("userId", timestamp, "textContent", "isRepost", "isQuotePost", "isReply") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

module.exports = {
  addPost,
  getAllPosts,
  getAllPosts2,
};
