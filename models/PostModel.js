const addPost = `INSERT INTO post ("userId", timestamp, "textContent", "isRepost", "isQuotePost") VALUES ($1, $2, $3, $4, $5)
RETURNING "postId", "textContent", timestamp, "isRepost", "isQuotePost"`;

const addReply = `INSERT INTO post ("userId", "parentPostId", timestamp, "textContent", "isRepost", "isQuotePost") VALUES ($1, $2, $3, $4, $5, $6)
RETURNING "postId", "parentPostId", "textContent", timestamp, "isRepost", "isQuotePost"`;

const getAllPosts = `WITH post_likes AS (
  SELECT "postId", 
	COUNT(*)::INT AS "numberOfLikes"
  FROM liked_post
  GROUP BY "postId"
  ),
  post_replies_reposts AS (
    SELECT "parentPostId",
	  COUNT(*)::INT AS "numberOfReplies",
	  COUNT(CASE WHEN "isRepost" = TRUE THEN 1 END) AS "numberOfReposts"
	FROM post
	WHERE "parentPostId" IS NOT NULL
	GROUP BY "parentPostId"
  )
  SELECT p."postId",
    u.username,
    u."displayName",
    p."textContent",
    p.timestamp,
    EXISTS(SELECT 1 FROM liked_post li WHERE li."userId" = $1 AND li."postId" = p."postId" LIMIT 1) AS "isLikedByCurrentUser",
    COALESCE(l."numberOfLikes",0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM post AS p
  LEFT JOIN post_likes AS l ON p."postId" = l."postId"
  LEFT JOIN post_replies_reposts AS r ON p."postId" = r."parentPostId"
  INNER JOIN app_user AS u ON p."userId" = u."userId"
  WHERE p."parentPostId" IS NULL
  ORDER BY p.timestamp DESC`;

const getPost = `WITH post_likes AS (
  SELECT "postId", 
	COUNT(*)::INT AS "numberOfLikes"
  FROM liked_post
  GROUP BY "postId"
  ),
  post_replies_reposts AS (
    SELECT "parentPostId",
	  COUNT(*)::INT AS "numberOfReplies",
	  COUNT(CASE WHEN "isRepost" = TRUE THEN 1 END) AS "numberOfReposts"
	FROM post
	WHERE "parentPostId" IS NOT NULL
	GROUP BY "parentPostId"
  )
  SELECT p."postId",
    u.username,
    u."displayName",
    p."textContent",
    p.timestamp,
    EXISTS(SELECT 1 FROM liked_post li WHERE li."userId" = $1 AND li."postId" = p."postId" LIMIT 1) AS "isLikedByCurrentUser",
    COALESCE(l."numberOfLikes",0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM post AS p
  LEFT JOIN post_likes AS l ON p."postId" = l."postId"
  LEFT JOIN post_replies_reposts AS r ON p."postId" = r."parentPostId"
  INNER JOIN app_user AS u ON p."userId" = u."userId"
  WHERE p."postId" = $2`;

const getReplies = `WITH post_likes AS (
  SELECT "postId", 
	COUNT(*)::INT AS "numberOfLikes"
  FROM liked_post
  GROUP BY "postId"
  ),
  post_replies_reposts AS (
    SELECT "parentPostId",
	  COUNT(*)::INT AS "numberOfReplies",
	  COUNT(CASE WHEN "isRepost" = TRUE THEN 1 END) AS "numberOfReposts"
	FROM post
	WHERE "parentPostId" IS NOT NULL
	GROUP BY "parentPostId"
  )
  SELECT p."postId",
    u.username,
    u."displayName",
    p."textContent",
    p.timestamp,
    p."parentPostId",
    EXISTS(SELECT 1 FROM liked_post li WHERE li."userId" = $1 AND li."postId" = p."postId" LIMIT 1) AS "isLikedByCurrentUser",
    COALESCE(l."numberOfLikes",0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM post AS p
  LEFT JOIN post_likes AS l ON p."postId" = l."postId"
  LEFT JOIN post_replies_reposts AS r ON p."postId" = r."parentPostId"
  INNER JOIN app_user AS u ON p."userId" = u."userId"
  WHERE p."parentPostId" = $2
  ORDER BY "numberOfLikes" DESC`;

const likePost = `INSERT INTO liked_post ("userId", "postId") VALUES ($1, $2)`;

const unlikePost = `DELETE FROM liked_post WHERE "userId" = $1 AND "postId" = $2`;

module.exports = {
  addPost,
  getAllPosts,
  likePost,
  unlikePost,
  getPost,
  getReplies,
  addReply,
};
