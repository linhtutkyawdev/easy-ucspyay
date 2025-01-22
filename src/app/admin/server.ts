"use server";
import { turso } from "@/lib/utils";
import { randomBytes } from "crypto";

export async function createEvent(
  event_name: string,
  event_day: Date,
  titles: {
    name: string;
    type: string;
  }[]
) {
  try {
    if (
      (
        await turso.execute({
          sql: "SELECT * from events where event_name = ?",
          args: [event_name],
        })
      ).rows[0]?.event_name as string
    )
      return "event_name is already taken! :(";

    await turso.execute({
      sql: "INSERT INTO events VALUES (?,?);",
      args: [event_name, event_day],
    });
    console.log("Step-1");

    await turso.execute(`CREATE TABLE IF NOT EXISTS "${event_name}_contestants" (
      "id" VARCHAR(15) NOT NULL UNIQUE,
      "full_name" VERCHAR (255) NOT NULL,
      "image_url" VERCHAR (255) NOT NULL,
      "gender" VERCHAR(15) NOT NULL,
      "contestant_no" INTEGER,
      "nick_name" VERCHAR(15) NOT NULL,
      "height" VERCHAR(15) NOT NULL,
      PRIMARY KEY ("contestant_no","gender"),
      FOREIGN KEY ("id") REFERENCES "users" ("id")
      );`);
    console.log("Step-2");

    await turso.execute(`CREATE TABLE IF NOT EXISTS "${event_name}_titles" (
      "name" VARCHAR(255) NOT NULL,
      "allowed_contestant_group" VARCHAR(15),
      PRIMARY KEY ("name")
      );`);
    console.log("Step-3");

    // -- King, Popular, Handsome, Smart, Queen, Smile, Glory, Atteaction, Innocent, BestCouple - G2, All K, All Q, J
    titles.map(async (t) => {
      await turso.execute({
        sql: `INSERT INTO "${event_name}_titles" VALUES (?,?);`,
        args: [t.name, t.type],
      });
      await turso.execute(`CREATE TABLE IF NOT EXISTS "${event_name}_${t.name}" (
        "voter" VARCHAR(15) NOT NULL,
        "receiver" VARCHAR(15) NOT NULL,
        PRIMARY KEY ("voter"),
        FOREIGN KEY ("voter") REFERENCES "users" ("id"),
        FOREIGN KEY ("receiver") REFERENCES "users" ("id")
        );`);
    });
    console.log("Step-4");

    await turso.execute(`CREATE TABLE IF NOT EXISTS "${event_name}_voting_results" (
        "title" VARCHAR(15) NOT NULL,
        "winner" VARCHAR(15) NOT NULL,
        PRIMARY KEY ("winner"),
        FOREIGN KEY ("winner") REFERENCES "users" ("id"),
        FOREIGN KEY ("title") REFERENCES "${event_name}_titles" ("name")
        );`);
    console.log("Step-5");
  } catch (error) {
    console.log(error);
    return "An error has occured! :(";
  }
}

// export async function getSecret(event_name: string): Promise<string | null> {
//   try {
//     const existingVerificationKey = (
//       await turso.execute("SELECT * FROM contestant_verifications;")
//     ).rows[0]?.key as string;

//     if (existingVerificationKey) return existingVerificationKey;

//     return await setSecret(event_name);
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }

export async function addContestantSecret(event_name: string) {
  try {
    const secret =
      event_name + "_contestants:" + randomBytes(69).toString("base64");
    await turso.execute({
      sql: "INSERT INTO contestant_verifications VALUES (?);",
      args: [secret],
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function removeSecret() {
  try {
    await turso.execute("DELETE FROM contestant_verifications;");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// export async function getEventNames() {
//   try {
//     return (await turso.execute("SELECT * FROM events;")).rows.map(
//       (r) => r.event_name as string
//     );
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }

export async function addResult(
  event_name: string,
  title: string,
  contestant: string
) {
  try {
    await turso.execute({
      sql: `INSERT INTO "${event_name}_voting_results" VALUES (?,?);`,
      args: [title, contestant],
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getUnrevealedTitles(
  event_name: string
): Promise<string[] | null> {
  try {
    const titles = [
      "king",
      "handsome",
      "smart",
      "queen",
      "glory",
      "attraction",
      "smile",
      "best_couple",
    ];
    const revealed_titles = (
      await turso.execute(`SELECT title FROM "${event_name}_voting_results";`)
    ).rows.map((r) => r.title as string);
    return titles.filter((t) => !revealed_titles.includes(t));
  } catch (e) {
    console.log(e);
    return null;
  }
}
