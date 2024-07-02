const addPost = `
  INSERT INTO post (
    "userId", timestamp, "textContent", "isRepost", "isQuotePost"
  ) VALUES 
    ($1, $2, $3, $4, $5)
  RETURNING 
    "postId",
    "textContent",
    timestamp,
    "isRepost",
    "isQuotePost";
`;

const addReply = `
  INSERT INTO post (
    "userId", "parentPostId", timestamp, "textContent", "isRepost", "isQuotePost"
  ) VALUES
    ($1, $2, $3, $4, $5, $6)
  RETURNING 
    "postId",
    "parentPostId",
    "textContent",
    timestamp,
    "isRepost",
    "isQuotePost";
`;

const getAllPosts = `
  WITH post_likes AS (
    SELECT
      "postId", 
      COUNT(*)::INT AS "numberOfLikes"
    FROM liked_post
	WHERE "postId" IN (SELECT "postId" FROM post WHERE deleted = FALSE)
    GROUP BY "postId"
  ),
  post_replies_reposts AS (
    SELECT 
      "parentPostId",
      COUNT(*)::INT AS "numberOfReplies",
      COUNT(CASE WHEN "isRepost" = TRUE THEN 1 END) AS "numberOfReposts"
    FROM post
    WHERE "parentPostId" IS NOT NULL
	  AND deleted = FALSE
    GROUP BY "parentPostId"
  )
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    u."userId",
    p."textContent",
    p.timestamp,
    EXISTS (
      SELECT 1 
      FROM liked_post li 
      WHERE li."userId" = $1 
        AND li."postId" = p."postId" 
      LIMIT 1
    ) AS "isLikedByCurrentUser",
    COALESCE(l."numberOfLikes",0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
    FROM post AS p
    LEFT JOIN post_likes AS l
      ON p."postId" = l."postId"
    LEFT JOIN post_replies_reposts AS r
      ON p."postId" = r."parentPostId"
    INNER JOIN app_user AS u
      ON p."userId" = u."userId"
  WHERE p."parentPostId" IS NULL
  	AND p."deleted" = FALSE
  ORDER BY p.timestamp DESC;
`;

const getPost = `
   WITH post_likes AS (
    SELECT 
      "postId", 
      COUNT(*)::INT AS "numberOfLikes"
    FROM liked_post
	 WHERE "postId" IN (SELECT "postId" FROM post WHERE deleted = FALSE)
    GROUP BY "postId"
  ),
  post_replies_reposts AS (
    SELECT 
      "parentPostId",
      COUNT(*)::INT AS "numberOfReplies",
      COUNT(CASE WHEN "isRepost" = TRUE THEN 1 END) AS "numberOfReposts"
    FROM post
    WHERE "parentPostId" IS NOT NULL
	  AND deleted = FALSE
    GROUP BY "parentPostId"
  )
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    u."userId",
    p."textContent",
    p.timestamp,
    EXISTS (
      SELECT 1 
      FROM liked_post li 
      WHERE li."userId" = $1 
        AND li."postId" = p."postId" 
      LIMIT 1
    ) AS "isLikedByCurrentUser",
    COALESCE(l."numberOfLikes",0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM post AS p
  LEFT JOIN post_likes AS l
    ON p."postId" = l."postId"
  LEFT JOIN post_replies_reposts AS r
    ON p."postId" = r."parentPostId"
  INNER JOIN app_user AS u
    ON p."userId" = u."userId"
  WHERE p."postId" = $2
  	AND p."deleted" = FALSE;
`;

const getReplies = `
  WITH post_likes AS (
    SELECT
      "postId", 
      COUNT(*)::INT AS "numberOfLikes"
    FROM liked_post
    WHERE "postId" IN (SELECT "postId" FROM post WHERE deleted = FALSE)
    GROUP BY "postId"
  ),
  post_replies_reposts AS (
    SELECT
      "parentPostId",
      COUNT(*)::INT AS "numberOfReplies",
      COUNT(CASE WHEN "isRepost" = TRUE THEN 1 END) AS "numberOfReposts"
    FROM post
    WHERE "parentPostId" IS NOT NULL
      AND deleted = FALSE
    GROUP BY "parentPostId"
  )
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    u."userId",
    p."textContent",
    p.timestamp,
    p."parentPostId",
    parent_post.deleted AS "parentPostDeleted",
    EXISTS (
      SELECT 1 
      FROM liked_post li 
      WHERE li."userId" = $1 
        AND li."postId" = p."postId" 
      LIMIT 1
    ) AS "isLikedByCurrentUser",
    COALESCE(l."numberOfLikes",0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM post AS p
  LEFT JOIN post_likes AS l
    ON p."postId" = l."postId"
  LEFT JOIN post_replies_reposts AS r
    ON p."postId" = r."parentPostId"
  INNER JOIN app_user AS u
    ON p."userId" = u."userId"
  LEFT JOIN post AS parent_post
    ON p."parentPostId" = parent_post."postId"
  WHERE p."parentPostId" = $2
    AND p."deleted" = FALSE
  ORDER BY "numberOfLikes" DESC, "timestamp" DESC;
`;

const deletePost = `WITH post_to_delete AS (
  SELECT "postId"
  FROM post
  WHERE "postId" = $1 AND "userId" = $2 AND deleted = FALSE
)
UPDATE post
SET deleted = TRUE
WHERE "postId" IN (SELECT "postId" FROM post_to_delete)
RETURNING "postId", deleted;`;

const likePost = `INSERT INTO liked_post ("userId", "postId") VALUES 
  ($1, $2)`;

const unlikePost = `DELETE FROM liked_post
  WHERE "userId" = $1
    AND "postId" = $2;
`;

module.exports = {
  addPost,
  getAllPosts,
  likePost,
  unlikePost,
  getPost,
  getReplies,
  addReply,
  deletePost,
};
