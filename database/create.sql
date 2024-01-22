CREATE TABLE IF NOT EXISTS "users" (
    "id" VARCHAR(15) NOT NULL PRIMARY KEY,
    "full_name" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "ucspyay_mail" VARCHAR(255) NULL,
    "is_admin"  BOOLEAN NOT NULL DEFAULT false
);
CREATE TABLE IF NOT EXISTS "user_verifications" (
    "id" VARCHAR(15) NOT NULL, -- The one who generated the key
    "key" VARCHAR(255) NOT NULL,
    PRIMARY KEY ("id", "key"),
    FOREIGN KEY ("id") REFERENCES "users" ("id")
);

CREATE TABLE IF NOT EXISTS "events" (
    "event_name" VARCHAR(255) NOT NULL,
    "event_day" DATE NOT NULL,
    PRIMARY KEY ("event_name")
);

CREATE TABLE IF NOT EXISTS "contestant_verifications" (
    "key" VARCHAR(255) NOT NULL,
    PRIMARY KEY ("key")
);

-- CREATE TABLE IF NOT EXISTS "votings" (
--     "title" VARCHAR(15) NOT NULL,
--     "winner" VARCHAR(15) NOT NULL,
--     PRIMARY KEY ("winner"),
--     FOREIGN KEY ("winner") REFERENCES "users" ("id"),
--     FOREIGN KEY ("title") REFERENCES "titles" ("name")
-- );

-- CREATE TABLE IF NOT EXISTS "2024_titles" (
--     "name" VARCHAR(255) NOT NULL, -- King, Popular, Handsome, Smart, Queen, Smile, Glory, Atteaction, Innocent, BestCouple - G2, All K, All Q, J
--     "member_count" INT NOT NULL DEFAULT 1,
--     "allowed_contestant_group" VARCHAR(15), -- All, Male, Female, Group, Global
--     PRIMARY KEY ("name")
-- );


-- CREATE TABLE IF NOT EXISTS "2024_welcome_contestant_groups" (
--     "id" VARCHAR(15) NOT NULL,
--     "member_1" VARCHAR(15) NOT NULL,
--     "member_2" VARCHAR(15) NOT NULL,
--     "image_url_1" VARCHAR(255),
--     "image_url_2" VARCHAR(255),
--     "image_url_3" VARCHAR(255),
--     PRIMARY KEY ("id"),
--     FOREIGN KEY ("member_1") REFERENCES "users" ("id"),
--     FOREIGN KEY ("member_2") REFERENCES "users" ("id")
-- );



-- CREATE TABLE IF NOT EXISTS "king" (
--     "voter" VARCHAR(15) NOT NULL,
--     "receiver" VARCHAR(15) NOT NULL,
--     PRIMARY KEY ("voter"),
--     FOREIGN KEY ("voter") REFERENCES "users" ("id"),
--     FOREIGN KEY ("receiver") REFERENCES "users" ("id")
-- );

-- CREATE TABLE IF NOT EXISTS "best_couple" (
--     "voter" VARCHAR(15) NOT NULL,
--     "receiver" VARCHAR(15) NOT NULL,
--     PRIMARY KEY ("voter"),
--     FOREIGN KEY ("voter") REFERENCES "users" ("id"),
--     FOREIGN KEY ("receiver") REFERENCES "2024_welcome_contestant_groups" ("id")
-- );



