"use server";

import { isEndWithUCSPyayDomain, turso } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export async function getUser(event_name?: string): Promise<{
  id: string;
  full_name: string;
  image_url: string;
  is_admin: boolean;
  ucspyay_mail?: string;
} | null> {
  try {
    const { userId } = auth();
    if (userId) {
      const existingUser = (
        await turso.execute({
          sql: "SELECT * FROM users WHERE id = ?;",
          args: [userId],
        })
      ).rows[0];

      const contestantData = (
        await turso.execute({
          sql: `SELECT * FROM "${event_name}_contestants" WHERE id = ?;`,
          args: [userId],
        })
      ).rows[0];

      const user = await currentUser();

      console.log(existingUser);

      if (!user) return null;

      // find ucspyay@mail
      const ucspyay_mail = user.emailAddresses.find((email) =>
        isEndWithUCSPyayDomain(email.emailAddress)
      )?.emailAddress;

      if (!existingUser) {
        // Gyoung
        if (!ucspyay_mail) return null;

        await turso.execute({
          sql: "INSERT INTO users VALUES (?,?,?,?,?);",
          args: [
            userId,
            (user.firstName || "") + " " + (user.lastName || ""),
            user.imageUrl,
            ucspyay_mail,
            false,
          ],
        });
      }

      // if img updated - sync the db
      user.imageUrl != (existingUser?.image_url as string) &&
        (await turso.execute(
          `UPDATE users SET image_url = '${user.imageUrl}' WHERE id = '${userId}';`
        ));
      user.imageUrl != (contestantData?.image_url as string) &&
        (await turso.execute(
          `UPDATE "${event_name}_contestants" SET image_url = '${user.imageUrl}' WHERE id = '${userId}';`
        ));

      // if name updated - sync the db
      user.firstName + " " + user.lastName !=
        (existingUser.full_name as string) &&
        (await turso.execute(
          `UPDATE users SET full_name = '${
            user.firstName + " " + user.lastName
          }' WHERE id = '${userId}';`
        ));

      user.firstName + " " + user.lastName !=
        (contestantData.full_name as string) &&
        (await turso.execute(
          `UPDATE "${event_name}_contestants" SET full_name = '${
            user.firstName + " " + user.lastName
          }' WHERE id = '${userId}';`
        ));

      // if ucspyay_mail updated - sync the db
      ucspyay_mail &&
        ucspyay_mail != (existingUser.ucspyay_mail as string) &&
        (await turso.execute(
          `UPDATE users SET ucspyay_mail = '${ucspyay_mail}' WHERE id = '${userId}';`
        ));

      return {
        id: userId,
        full_name: user.firstName + " " + user.lastName,
        image_url: user.imageUrl,
        ucspyay_mail,
        is_admin: existingUser.is_admin ? true : false,
      };
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateUser(
  id: string,
  field: string,
  value: string
): Promise<boolean> {
  try {
    await turso.execute({
      sql: `UPDATE users SET ${field} = ? WHERE id = ?;`,
      args: [value, id],
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getContestants(event_name: string): Promise<
  | {
      event_name: string;
      contestant_no: number;
      id: string;
      full_name: string;
      image_url: string;
      gender: string;
      nick_name: string;
      height: number;
    }[]
  | null
> {
  try {
    return (
      await turso.execute(`SELECT * FROM "${event_name}_contestants"`)
    ).rows.map((r) => ({
      event_name,
      contestant_no: r.contestant_no as number,
      id: r.id as string,
      full_name: r.full_name as string,
      image_url: r.image_url as string,
      gender: r.gender as string,
      height: r.height as number,
      nick_name: r.nick_name as string,
    }));
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function vote(
  event_name: string,
  title: string,
  voter: string,
  receiver: string
): Promise<boolean> {
  try {
    await turso.execute({
      sql: `INSERT INTO "${event_name}_${title}" VALUES (?,?)`,
      args: [voter, receiver],
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getApplicableTitles(
  event_name: string,
  allowed_contestant_group: string,
  voter: string
): Promise<string[] | null> {
  try {
    return (
      await Promise.all(
        (
          await turso.execute({
            sql: `SELECT name FROM "${event_name}_titles" WHERE allowed_contestant_group = ? ;`,
            args: [allowed_contestant_group],
          })
        ).rows.map(async (r) => {
          return (
            await turso.execute({
              sql: `SELECT receiver FROM "${event_name}_${
                r.name as string
              }" WHERE voter = ? ;`,
              args: [voter],
            })
          ).rows.length
            ? null
            : (r.name as string);
        })
      )
    ).filter((t) => t) as string[];
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getTitles(event_name: string): Promise<string[] | null> {
  try {
    return (
      await turso.execute(`SELECT * FROM "${event_name}_titles";`)
    ).rows.map((r) => r.title_name as string);
  } catch (e) {
    console.log(e);
    return null;
  }
}
export async function isVoted(
  event_name: string,
  title: string,
  id: string
): Promise<boolean> {
  try {
    return (
      (
        await turso.execute({
          sql: `SELECT * FROM "${event_name}_${title}" WHERE voter = ? ;`,
          args: [id],
        })
      ).rows.length == 1
    );
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getRemainingVotableTitles(
  event_name: string,
  id: string
): Promise<string[] | null> {
  try {
    const titles = await getTitles(event_name);
    if (!titles || titles?.length == 0) return null;
    return (
      await Promise.all(
        titles.map(async (t) => ((await isVoted(event_name, t, id)) ? null : t))
      )
    ).filter((t) => t) as string[];
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getResults(
  event_name: string,
  title: string
): Promise<{ id: string; total_vote_count: number }[] | null> {
  try {
    return (
      await turso.execute(
        `SELECT receiver, COUNT(voter) AS total_vote_count FROM "${event_name}_${title}" GROUP BY receiver ORDER BY total_vote_count DESC;`
      )
    ).rows.map((r) => ({
      id: r.receiver as string,
      total_vote_count: r.total_vote_count as number,
    }));
  } catch (e) {
    console.log(e);
    return null;
  }
}
