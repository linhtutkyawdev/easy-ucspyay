-- Main (likely)
DROP TABLE IF EXISTS "events";
DROP TABLE IF EXISTS "user_verifications";
DROP TABLE IF EXISTS "contestant_verifications";
DROP TABLE IF EXISTS "users";
-- Duplicable (2024_welcome) is the event name
DROP TABLE IF EXISTS "2024_welcome_contestants";
DROP TABLE IF EXISTS "2024_welcome_titles";
DROP TABLE IF EXISTS "2024_welcome_voting_results";
DROP TABLE IF EXISTS "2024_welcome_king";
DROP TABLE IF EXISTS "2024_welcome_smart";
DROP TABLE IF EXISTS "2024_welcome_handsome";
DROP TABLE IF EXISTS "2024_welcome_queen";
DROP TABLE IF EXISTS "2024_welcome_glory";
DROP TABLE IF EXISTS "2024_welcome_smile";
DROP TABLE IF EXISTS "2024_welcome_attraction";
DROP TABLE IF EXISTS "2024_welcome_best_couple";
-- DELETE FROM "2024_welcome_king" WHERE voter = "user_2ax6YzStZ6k8fQX2DvLApOOKkrQ";
DELETE FROM "events" WHERE event_name = "2024_welcome";
