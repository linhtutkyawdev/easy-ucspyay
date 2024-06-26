"use server";
import { turso } from "@/lib/utils";

export async function getEvents(): Promise<
  { event_name: string; event_day: Date }[] | null
> {
  try {
    return (
      await turso.execute(`SELECT * FROM events ORDER BY event_day DESC;`)
    ).rows.map((r) => ({
      event_name: r.event_name as string,
      event_day: new Date(r.event_day as string),
    }));
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getUsers(): Promise<
  | {
      id: string;
      full_name: string;
      image_url: string;
      ucspyay_mail: string;
      is_admin: boolean;
    }[]
  | null
> {
  try {
    return (await turso.execute("SELECT * FROM users;")).rows.map((r) => ({
      id: r.id as string,
      full_name: r.full_name as string,
      image_url: r.image_url as string,
      ucspyay_mail: r.ucspyay_mail as string,
      is_admin: r.is_admin ? true : false,
    }));
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getUser(id: string): Promise<{
  id: string;
  full_name: string;
  image_url: string;
  ucspyay_mail: string;
  is_admin: boolean;
} | null> {
  try {
    return (
      await turso.execute({
        sql: "SELECT * FROM users WHERE id = ?;",
        args: [id],
      })
    ).rows.map((r) => ({
      id: r.id as string,
      full_name: r.full_name as string,
      image_url: r.image_url as string,
      ucspyay_mail: r.ucspyay_mail as string,
      is_admin: r.is_admin ? true : false,
    }))[0];
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function addUser(user: {
  id: string;
  full_name: string;
  image_url: string;
  ucspyay_mail: string;
  is_admin: boolean;
}): Promise<boolean> {
  try {
    await turso.execute({
      sql: "INSERT INTO users VALUES (?,?,?,?,?);",
      args: [
        user.id,
        user.full_name,
        user.image_url,
        user.ucspyay_mail,
        user.is_admin,
      ],
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function updateContestant(
  event_name: string,
  id: string,
  field: string,
  value: string
): Promise<boolean> {
  try {
    await turso.execute({
      sql: `UPDATE "${event_name}_contestants" SET ${field} = ? where id = ?;`,
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
      await turso.execute(
        `SELECT * FROM "${event_name}_contestants" ORDER BY contestant_no ASC;`
      )
    ).rows.map((r) => ({
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

export async function getContestant(
  event_name: string,
  id: string
): Promise<{
  contestant_no: number;
  id: string;
  full_name: string;
  image_url: string;
  gender: string;
  nick_name: string;
  height: number;
} | null> {
  try {
    return (
      await turso.execute({
        sql: `SELECT * FROM "${event_name}_contestants" WHERE id= ?;`,
        args: [id],
      })
    ).rows.map((r) => ({
      contestant_no: r.contestant_no as number,
      id: r.id as string,
      full_name: r.full_name as string,
      image_url: r.image_url as string,
      gender: r.gender as string,
      height: r.height as number,
      nick_name: r.nick_name as string,
    }))[0];
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getTitles(
  event_name: string
): Promise<{ name: string; allowed_contestant_group: string }[] | null> {
  try {
    return (
      await turso.execute(`SELECT * FROM "${event_name}_titles";`)
    ).rows.map((r) => ({
      name: r.name as string,
      allowed_contestant_group: r.allowed_contestant_group as string,
    }));
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getSecrets(): Promise<
  | {
      id: string;
      key: string;
    }[]
  | null
> {
  try {
    return (await turso.execute("SELECT * FROM user_verifications;")).rows.map(
      (r) => ({
        id: r.id as string,
        key: r.key as string,
      })
    );
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getSecret(id: string): Promise<{
  id: string;
  key: string;
} | null> {
  try {
    return (
      await turso.execute({
        sql: "SELECT * FROM user_verifications WHERE id = ?;",
        args: [id],
      })
    ).rows.map((r) => ({
      id: r.id as string,
      key: r.key as string,
    }))[0];
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getContestantSecrets(): Promise<
  | {
      key: string;
    }[]
  | null
> {
  try {
    return (
      await turso.execute("SELECT * FROM contestant_verifications;")
    ).rows.map((r) => ({
      key: r.key as string,
    }));
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function voteReceiver(
  event_name: string,
  title: string,
  id: string
): Promise<string | null> {
  try {
    return (
      await turso.execute({
        sql: `SELECT receiver FROM "${event_name}_${title}" WHERE voter = ? ;`,
        args: [id],
      })
    ).rows[0]?.receiver as string;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getVotes(
  event_name: string,
  voter: string
): Promise<{ title: string; receiver: string | null }[] | null> {
  try {
    const titles = await getTitles(event_name);
    if (!titles || titles?.length == 0) return null;
    return (
      await Promise.all(
        titles.map(async (t) => ({
          title: t.name,
          receiver: await voteReceiver(event_name, t.name, voter),
        }))
      )
    ).filter((t) => t.receiver);
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getRemainingVotes(
  event_name: string,
  voter: string
): Promise<string[] | null> {
  try {
    const titles = await getTitles(event_name);
    if (!titles || titles?.length == 0) return null;
    return (
      await Promise.all(
        titles.map(async (t) => ({
          title: t.name,
          receiver: await voteReceiver(event_name, t.name, voter),
        }))
      )
    )
      .filter((t) => !t.receiver)
      .map((t) => t.title);
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

export async function getAllResults(
  event_name: string
): Promise<{ title: string; winner?: string }[] | null> {
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

    const kingResults = await getResults(event_name, "king");

    const handsomeResults = await getResults(event_name, "handsome");

    const smartResults = await getResults(event_name, "smart");

    const queenResults = await getResults(event_name, "queen");

    const gloryResults = await getResults(event_name, "glory");

    const attractionsResults = await getResults(event_name, "attraction");

    const smileResults = await getResults(event_name, "smile");

    const best_coupleResults = await getResults(event_name, "best_couple");

    let winners: string[] = [];
    [
      kingResults,
      handsomeResults,
      smartResults,
      queenResults,
      gloryResults,
      attractionsResults,
      smileResults,
    ].forEach((r) => {
      if (r) {
        let r_index = 0;
        while(r[r_index].id && winners.find((w) => w == r[r_index].id)) r_index++;
        winners = [...winners, r[r_index].id];
        console.log(winners); 
      }
    });
    if (best_coupleResults) winners = [...winners, best_coupleResults[0]?.id];
    return winners.map((w, i) => ({
      title: titles[i],
      winner: w,
    }));
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getAllPublicResults(
  event_name: string
): Promise<{ title: string; winner?: string }[] | null> {
  try {
    return (
      await turso.execute(`SELECT * FROM "${event_name}_voting_results";`)
    ).rows.map((r) => ({
      title: r.title as string,
      winner: r?.winner as string,
    }));
  } catch (e) {
    console.log(e);
    return null;
  }
}
