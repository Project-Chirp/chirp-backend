const getUserPosts = `
  WITH post_likes AS (
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
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    p."textContent",
    p.timestamp,
    EXISTS(
      SELECT 1 
      FROM liked_post li 
      WHERE li."userId" = u."userId" 
      AND li."postId" = p."postId" 
      LIMIT 1
    ) AS "isLikedByCurrentUser",
    COALESCE(l."numberOfLikes",0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM 
    post AS p
    LEFT JOIN post_likes AS l ON p."postId" = l."postId"
    LEFT JOIN post_replies_reposts AS r ON p."postId" = r."parentPostId"
    INNER JOIN app_user AS u ON p."userId" = u."userId"
  WHERE 
    u."username" = $1 
    AND p."parentPostId" IS NULL
  ORDER BY 
    p.timestamp DESC`;

const getUserReplies = `
  WITH post_likes AS (
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
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    p."textContent",
    p.timestamp,
    EXISTS(
      SELECT 1 
      FROM liked_post li 
      WHERE li."userId" = u."userId" 
      AND li."postId" = p."postId" 
      LIMIT 1
    ) AS "isLikedByCurrentUser",
    COALESCE(l."numberOfLikes",0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM 
    post AS p
    LEFT JOIN post_likes AS l ON p."postId" = l."postId"
    LEFT JOIN post_replies_reposts AS r ON p."postId" = r."parentPostId"
    INNER JOIN app_user AS u ON p."userId" = u."userId"
  WHERE 
    u."username" = $1 
    AND p."parentPostId" IS NOT NULL
  ORDER BY 
    p.timestamp DESC`;

const getUserLikes = `
  WITH post_likes AS (
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
  SELECT 
    p."postId",
    u."username",
    u."displayName",
    p."textContent",
    p."timestamp",
    TRUE AS "isLikedByCurrentUser",
    COALESCE(l."numberOfLikes",0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM 
    post AS p
    INNER JOIN app_user AS u ON p."userId" = u."userId"
    LEFT JOIN post_likes AS l ON p."postId" = l."postId"
    LEFT JOIN post_replies_reposts AS r ON p."postId" = r."parentPostId"
  WHERE EXISTS (
    SELECT 1
    FROM liked_post li
    INNER JOIN app_user u on li."userId" = u."userId"
    WHERE u."username" = $1
    AND li."postId" = p."postId"
    LIMIT 1
  )
  ORDER BY p.timestamp DESC`;

const getProfileContents = `SELECT 
(SELECT COUNT(*) FROM post WHERE "userId" = a."userId") AS "postCount",
a."bio",
a."joinedDate",
a."displayName",
a."username",
(SELECT COUNT(*) FROM follow WHERE "followedUserId" = a."userId" AND "followStatus" = TRUE ) AS "followerCount",
(SELECT COUNT(*) FROM follow WHERE "followerUserId" = a."userId" AND "followStatus" = TRUE ) AS "followingCount",
f."followStatus" AS "followStatus"
FROM app_user AS a
LEFT JOIN follow as f ON f."followerUserId" = $1 AND f."followedUserId" = a."userId"
WHERE a."username" = $2`;

const getFollowStatus = `SELECT 
CASE 
    WHEN EXISTS (
        SELECT 1
        FROM follow
        WHERE "followerUserId" = $1
          AND "followedUserId" = (SELECT "userId" FROM app_user WHERE "username" = $2)
          AND "followStatus" = TRUE
    ) THEN TRUE
    ELSE FALSE
END AS "followStatus";`;

const followUser = `INSERT INTO follow ("followerUserId", "followedUserId", "followedDate", "followStatus")
SELECT $1, "userId", CURRENT_DATE, TRUE
FROM app_user
WHERE "username" = $2
ON CONFLICT ("followerUserId", "followedUserId")
DO UPDATE SET "followStatus" = TRUE, "followedDate" = CURRENT_DATE
RETURNING *;
`;

const unfollowUser = `WITH otherUser AS (
SELECT "userId"
FROM app_user
WHERE "username" = $2
LIMIT 1
)
UPDATE follow
SET "followStatus" = FALSE
WHERE "followerUserId" = $1
AND "followedUserId" = (SELECT "userId" FROM otherUser)
RETURNING *`;

module.exports = {
  getUserPosts,
  getUserReplies,
  getUserLikes,
  getProfileContents,
  getFollowStatus,
  followUser,
  unfollowUser,
};
