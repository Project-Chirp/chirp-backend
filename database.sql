CREATE DATABASE twitter_clone;

CREATE TABLE app_user(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL
);

CREATE TABLE message(
    message_id SERIAL PRIMARY KEY,
    message_timestamp TIMESTAMPTZ NOT NULL,
    text_content TEXT,
    sent_user_id INT NOT NULL,
    CONSTRAINT fk_sent_user_id
        FOREIGN KEY(sent_user_id)
            REFERENCES app_user(user_id),
    received_user_id INT NOT NULL,
    CONSTRAINT fk_received_user_id
        FOREIGN KEY(received_user_id)
            REFERENCES app_user(user_id)
);

CREATE TABLE message_media(
    message_id INT NOT NULL,
    CONSTRAINT fk_message_id
        FOREIGN KEY(message_id)
            REFERENCES message(message_id),
    link TEXT NOT NULL,
    PRIMARY KEY(message_id, link)
);

CREATE TABLE post(
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
     CONSTRAINT fk_user_id
        FOREIGN KEY(user_id)
            REFERENCES app_user(user_id),
    parent_post_id INT,
    CONSTRAINT fk_parent_post_id
        FOREIGN KEY(parent_post_id)
            REFERENCES post(post_id),
    post_timestamp TIMESTAMPTZ NOT NULL,
    text_content TEXT,
    is_repost BOOLEAN NOT NULL,
    is_quote_post BOOLEAN NOT NULL
);

CREATE TABLE post_media(
    post_id INT NOT NULL,
    CONSTRAINT fk_post_id
        FOREIGN KEY(post_id)
            REFERENCES post(post_id),
    link TEXT NOT NULL,
    PRIMARY KEY(post_id, link)
);

CREATE TABLE liked_post(
    user_id INT NOT NULL,
    CONSTRAINT fk_user_id
        FOREIGN KEY(user_id)
            REFERENCES app_user(user_id),
    post_id INT NOT NULL,
    CONSTRAINT fk_post_id
        FOREIGN KEY(post_id)
            REFERENCES post(post_id),
    PRIMARY KEY(user_id,post_id)
);

CREATE TABLE follow(
    follower_user_id INT NOT NULL,
    CONSTRAINT fk_follower_user_id
        FOREIGN KEY(follower_user_id)
            REFERENCES app_user(user_id),
    followed_user_id INT NOT NULL,
    CONSTRAINT fk_followed_user_id
        FOREIGN KEY(followed_user_id)
            REFERENCES app_user(user_id),
    followed_date DATE NOT NULL,
    follow_status BOOLEAN NOT NULL,
    PRIMARY KEY(follower_user_id, followed_user_id)
);