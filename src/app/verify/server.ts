"use server";
import { turso } from "@/lib/utils";
import { randomBytes } from "crypto";

export async function setUserSecret(id: string) {
  try {
    const secret = "user:" + randomBytes(69).toString("base64");
    await turso.execute({
      sql: "INSERT INTO user_verifications VALUES (?,?);",
      args: [id, secret],
    });
    return secret;
  } catch (error) {
    console.log(error);
    return null;
  }
}
