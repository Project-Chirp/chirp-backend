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
    "isQuotePost",
    "userId";
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
    "isQuotePost",
    "userId";
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
    COUNT(CASE WHEN "isRepost" = FALSE AND "isQuotePost" = FALSE THEN 1 END)::INT AS "numberOfReplies",
    COUNT(CASE WHEN "isRepost" = TRUE THEN 1 END)::INT AS "numberOfReposts"
  FROM post
  WHERE "parentPostId" IS NOT NULL
    AND deleted = FALSE
  GROUP BY "parentPostId"
),
post_metrics AS (
  SELECT
    p."postId",
    COALESCE(l."numberOfLikes", 0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM post AS p
  LEFT JOIN post_likes AS l ON p."postId" = l."postId"
  LEFT JOIN post_replies_reposts AS r ON p."postId" = r."parentPostId"
  WHERE p.deleted = FALSE
)
SELECT 
  p."postId",
  p."parentPostId",
  u.username AS "repostedUsername", 
  u."displayName" AS "repostedDisplayName", 
  COALESCE(p_parent."textContent", p."textContent") AS "textContent", 
  COALESCE(up.username, u.username) AS username, -- Parent post's username for reposts
  COALESCE(up."displayName", u."displayName") AS "displayName", 
  p."userId",
  p.timestamp,
  p."editedTimestamp",
  p."isRepost",
  p."isQuotePost",
  EXISTS (
    SELECT 1 
    FROM liked_post li 
    WHERE li."userId" = $1
      AND li."postId" = COALESCE(p."parentPostId", p."postId") 
    LIMIT 1
  ) AS "isLikedByCurrentUser",
  EXISTS (
    SELECT 1 
    FROM post rp
    WHERE (rp."parentPostId" = p."postId" OR rp."parentPostId" = p."parentPostId")
      AND rp."isRepost" = TRUE 
      AND rp."userId" = $1
      AND rp."deleted" = FALSE
    LIMIT 1
  ) AS "isRepostedByCurrentUser",
  COALESCE(
    CASE 
      WHEN p."isRepost" = TRUE THEN pm."numberOfLikes"
      ELSE lm."numberOfLikes"
    END, 0
  ) AS "numberOfLikes",
  COALESCE(
    CASE 
      WHEN p."isRepost" = TRUE THEN pm."numberOfReplies"
      ELSE lm."numberOfReplies"
    END, 0
  ) AS "numberOfReplies",
  COALESCE(
    CASE 
      WHEN p."isRepost" = TRUE THEN pm."numberOfReposts"
      ELSE lm."numberOfReposts"
    END, 0
  ) AS "numberOfReposts"
FROM post AS p
LEFT JOIN post_metrics AS lm
  ON p."postId" = lm."postId"
LEFT JOIN post_metrics AS pm
  ON p."parentPostId" = pm."postId"
LEFT JOIN post AS p_parent
  ON p."parentPostId" = p_parent."postId" 
LEFT JOIN app_user AS up
  ON p_parent."userId" = up."userId" 
INNER JOIN app_user AS u
  ON p."userId" = u."userId" 
WHERE p."deleted" = FALSE
AND (
    p."parentPostId" IS NULL -- Include original posts
    OR (p."isRepost" = TRUE OR p."isQuotePost" = TRUE) 
  )
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
    p."editedTimestamp",
    EXISTS (
      SELECT 1 
      FROM liked_post li 
      WHERE li."userId" = $1 
        AND li."postId" = p."postId" 
      LIMIT 1
    ) AS "isLikedByCurrentUser",
     CASE
      WHEN EXISTS (
        SELECT 1
        FROM follow WHERE "followerUserId" = $1
          AND "followedUserId" = u."userId"
      )
      THEN TRUE
      ELSE FALSE
    END AS "followStatus",
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
    p."editedTimestamp",
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

  WHERE p."parentPostId" = $2
    AND p."deleted" = FALSE
  ORDER BY "numberOfLikes" DESC, "timestamp" DESC;
`;

const deletePost = `
  UPDATE post
  SET deleted = TRUE
  WHERE "postId" = $1
  AND deleted = FALSE`;

const likePost = `INSERT INTO liked_post ("userId", "postId") VALUES 
  ($1, $2)`;

const unlikePost = `DELETE FROM liked_post
  WHERE "userId" = $1
    AND "postId" = $2;
`;

const editPost = `
UPDATE post as p
SET "textContent" = $2, 
    "editedTimestamp" = $3
WHERE p."postId" = $1;
`;

const addRepost = `
INSERT INTO post (
    "userId", "parentPostId", timestamp, "isRepost", "isQuotePost"
  ) VALUES
    ($1, $2, $3, $4, $5)
  RETURNING 
    "postId",
    "parentPostId",
    "textContent",
    timestamp,
    "isRepost",
    "isQuotePost",
    "userId";
`;

const deleteRepost = `
DELETE FROM post
WHERE "parentPostId" = $2
  AND "isRepost" = TRUE
  AND "userId" = $1
  AND deleted = FALSE;
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
  editPost,
  addRepost,
  deleteRepost,
};
