const editProfile = `
  UPDATE app_user
  SET "displayName" = $1,"birthDate" = $2, "bio" = $3
  WHERE "userId" = $4;
`;

const getUserPosts = `
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
      COUNT(CASE WHEN "repostedBy" IS NULL THEN 1 END)::INT AS "numberOfReplies",
      COUNT(CASE WHEN "repostedBy" IS NOT NULL THEN 1 END)::INT AS "numberOfReposts"
    FROM post
    WHERE "parentPostId" IS NOT NULL
      AND deleted = FALSE
    GROUP BY "parentPostId"
  ),
  parent_post_content AS (
	  SELECT
	  	p."postId" AS "repostId",
	  	parent_post."postId" AS "originalPostId",
      parent_post."textContent" AS "originalTextContent",
      parent_post."timestamp" AS "originalTimestamp",
		  "username" AS "originalPostUsername",
	  	parent_post."editedTimestamp" AS "originalEditedTimestamp",
		  "displayName" AS "originalDisplayName"
	  FROM post p
	  INNER JOIN post AS parent_post
	  	ON parent_post."postId" = p."parentPostId" AND p."repostedBy" IS NOT NULL
	  INNER JOIN app_user AS u
	  	ON parent_post."userId" = u."userId"
  )
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    p."textContent",
    p.timestamp,
    u."userId",
    p."editedTimestamp",
    p."parentPostId",
    ru."displayName" AS "repostedByDisplayName",
    EXISTS (
      SELECT 1 
      FROM liked_post li 
      WHERE li."userId" = $1
        AND (p."parentPostId" = li."postId"
		    OR p."postId" = li."postId")
        AND p.deleted = FALSE
      LIMIT 1
    ) AS "isLikedByCurrentUser",
    EXISTS (
      SELECT 1 
      FROM post p2
      WHERE p2."repostedBy" = $1
        AND p2."textContent" IS NULL
		    AND (p2."parentPostId" = COALESCE(p."parentPostId", p."postId")
		    OR p2."postId" = COALESCE(p."parentPostId", p."postId"))
        AND p2.deleted = FALSE
      LIMIT 1
    ) AS "isRepostedByCurrentUser",
    COALESCE(l."numberOfLikes", 0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts",
    CASE
      WHEN p."repostedBy" IS NOT NULL THEN json_build_object(
        'textContent', parent_post_content."originalTextContent",
        'timestamp', parent_post_content."originalTimestamp",
        'username', parent_post_content."originalPostUsername",
        'editedTimestamp', parent_post_content."originalEditedTimestamp",
        'displayName', parent_post_content."originalDisplayName"
      )
      ELSE NULL
	  END AS "originalPostContent"
  FROM post AS p
  LEFT JOIN post_likes AS l
    ON l."postId" = CASE
    WHEN p."repostedBy" IS NOT NULL AND p."textContent" IS NULL THEN p."parentPostId" -- Get stats of original post if it's a repost
    ELSE p."postId"
    END
  LEFT JOIN post_replies_reposts AS r
    ON r."parentPostId" = CASE
    WHEN p."repostedBy" IS NOT NULL AND p."textContent" IS NULL THEN p."parentPostId" -- Get stats of original post if it's a repost
    ELSE p."postId"
    END
  LEFT JOIN parent_post_content
		ON parent_post_content."repostId" = p."postId"
  INNER JOIN app_user AS u
    ON p."userId" = u."userId"
  LEFT JOIN app_user AS ru
    ON ru."userId" = p."repostedBy"
  WHERE u."userId" = $1
    AND NOT(p."parentPostId" IS NOT NULL AND p."repostedBy" IS NULL) -- Filter out replies
    AND p.deleted = FALSE
  ORDER BY p.timestamp DESC;
`;

const getUserReplies = `
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
      COUNT(CASE WHEN "repostedBy" IS NULL THEN 1 END)::INT AS "numberOfReplies",
      COUNT(CASE WHEN "repostedBy" IS NOT NULL THEN 1 END) AS "numberOfReposts"
    FROM post
    WHERE "parentPostId" IS NOT NULL
      AND deleted = FALSE
    GROUP BY "parentPostId"
  )
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    p."textContent",
    p.timestamp,
    u."userId",
    EXISTS (
      SELECT 1 
      FROM liked_post li 
      WHERE li."userId" = u."userId" 
        AND li."postId" = p."postId" 
      LIMIT 1
    ) AS "isLikedByCurrentUser",
    EXISTS (
      SELECT 1 
      FROM post p2
      WHERE p2."repostedBy" = $1
        AND p2."textContent" IS NULL
        AND COALESCE(p2."parentPostId", p2."postId") = COALESCE(p."parentPostId", p."postId")
        AND p2.deleted = FALSE
      LIMIT 1
    ) AS "isRepostedByCurrentUser",
    COALESCE(l."numberOfLikes", 0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM post AS p
  LEFT JOIN post_likes AS l
    ON p."postId" = l."postId"
  LEFT JOIN post_replies_reposts AS r
    ON p."postId" = r."parentPostId"
  INNER JOIN app_user AS u
    ON p."userId" = u."userId"
  WHERE u."userId" = $1 
    AND p."parentPostId" IS NOT NULL
    AND p."repostedBy" IS NULL
    AND p.deleted = FALSE
  ORDER BY p.timestamp DESC;
`;

const getUserLikes = `
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
      COUNT(CASE WHEN "repostedBy" IS NULL THEN 1 END)::INT AS "numberOfReplies",
      COUNT(CASE WHEN "repostedBy" IS NOT NULL THEN 1 END)::INT AS "numberOfReposts"
    FROM post
    WHERE "parentPostId" IS NOT NULL
      AND deleted = FALSE
    GROUP BY "parentPostId"
  )
  SELECT 
    p."postId",
    u.username,
    u."displayName",
    p."textContent",
    p.timestamp,
    u."userId",
    TRUE AS "isLikedByCurrentUser",
    EXISTS (
      SELECT 1 
      FROM post p2
      WHERE p2."repostedBy" = $1
        AND p2."textContent" IS NULL
		    AND (p2."parentPostId" = COALESCE(p."parentPostId", p."postId")
		    OR p2."postId" = COALESCE(p."parentPostId", p."postId"))
        AND p2.deleted = FALSE
      LIMIT 1
    ) AS "isRepostedByCurrentUser",
    COALESCE(l."numberOfLikes", 0) AS "numberOfLikes",
    COALESCE(r."numberOfReplies", 0) AS "numberOfReplies",
    COALESCE(r."numberOfReposts", 0) AS "numberOfReposts"
  FROM post AS p
  INNER JOIN app_user AS u
    ON p."userId" = u."userId"
  LEFT JOIN post_likes AS l
    ON l."postId" = CASE
    WHEN p."repostedBy" IS NOT NULL AND p."textContent" IS NULL THEN p."parentPostId" -- Get stats of original post if it's a repost
    ELSE p."postId"
    END
  LEFT JOIN post_replies_reposts AS r
    ON r."parentPostId" = CASE
    WHEN p."repostedBy" IS NOT NULL AND p."textContent" IS NULL THEN p."parentPostId" -- Get stats of original post if it's a repost
    ELSE p."postId"
    END
  WHERE EXISTS (
    SELECT 1
    FROM liked_post li
    INNER JOIN app_user AS u
      ON li."userId" = u."userId"
    WHERE u."userId" = $1
      AND li."postId" = p."postId"
  )
    AND p.deleted = FALSE
  ORDER BY p.timestamp DESC;
`;

const getProfileContents = `
  SELECT 
    (
      SELECT
        COUNT(*)
        FROM post
        WHERE "userId" = a."userId" AND deleted = FALSE
    ) AS "postCount",
    a."bio",
    a."joinedDate",
    a."displayName",
    a."username",
    a."birthDate",
    a."userId",
    (
      SELECT
        COUNT(*)
      FROM follow
      WHERE "followedUserId" = a."userId"
    ) AS "followerCount",
    (
      SELECT
        COUNT(*)
      FROM follow
      WHERE "followerUserId" = a."userId"
    ) AS "followingCount",
    CASE
      WHEN EXISTS (
        SELECT 1
        FROM follow WHERE "followerUserId" = $1
          AND "followedUserId" = a."userId"
      )
      THEN TRUE
      ELSE FALSE
    END AS "isFollowing"
  FROM app_user AS a
  WHERE a."username" = $2;
`;

module.exports = {
  editProfile,
  getUserPosts,
  getUserReplies,
  getUserLikes,
  getProfileContents,
};
