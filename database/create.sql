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
