"use server";
import { turso } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { randomBytes } from "crypto";

export async function getSecret(table: string): Promise<string | null> {
  try {
    const { userId } = auth();
    if (userId) {
      const existingVerificationKey = (
        await turso.execute({
          sql: `SELECT key FROM "${table}-verifications" WHERE id = ?`,
          args: [userId],
        })
      ).rows[0]?.key as string;

      if (existingVerificationKey) return existingVerificationKey;

      return await setSecret(userId, table + "-verifications");
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function setSecret(userId: string, table: string) {
  try {
    const secret = table + ":" + randomBytes(69).toString("base64");
    await turso.execute({
      sql: `INSERT INTO "${table}" VALUES (?, ?);`,
      args: [userId, secret],
    });
    return secret;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function verifySecret(
  secret: string,
  table: string,
  deleteAfterVerify?: boolean
): Promise<boolean> {
  try {
    const verificationKey = (
      await turso.execute({
        sql: `SELECT key FROM "${table}" WHERE key = ?;`,
        args: [secret],
      })
    ).rows[0]?.key as string;

    if (verificationKey) {
      deleteAfterVerify &&
        (await turso.execute({
          sql: `DELETE FROM "${table}" WHERE key = ?;`,
          args: [secret],
        }));
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function addUser(user: {
  id: string;
  full_name: string;
  image_url: string;
  ucspyay_mail?: string;
}): Promise<boolean> {
  try {
    await turso.execute({
      sql: "INSERT INTO users VALUES (?,?,?,?,?);",
      args: [
        user.id,
        user.full_name,
        user.image_url,
        user.ucspyay_mail || "",
        false,
      ],
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function addContestant(
  user: {
    id: string;
    full_name: string;
    image_url: string;
    gender: string;
    contestant_no: number;
    nick_name: string;
    height: string;
  },
  table: string
): Promise<boolean> {
  try {
    await turso.execute({
      sql: `INSERT INTO "${table}" VALUES (?,?,?,?,?,?,?);`,
      args: [
        user.id,
        user.full_name,
        user.image_url,
        user.gender,
        user.contestant_no,
        user.nick_name,
        user.height,
      ],
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getCount(
  table: string,
  key?: string,
  value?: string
): Promise<number> {
  try {
    const results =
      key && value
        ? (
            await turso.execute({
              sql: `SELECT * FROM "${table}" WHERE "${key}"=?`,
              args: [value],
            })
          ).rows
        : (await turso.execute(`SELECT * FROM "${table}";`)).rows;
    return results.length;
  } catch (error) {
    console.log(error);
    return 0;
  }
}
