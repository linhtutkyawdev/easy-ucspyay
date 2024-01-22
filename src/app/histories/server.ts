"use server";

import { turso } from "@/lib/utils";

export async function deleteVote(
  event_name: string,
  title: string,
  id: string
): Promise<boolean> {
  try {
    await turso.execute({
      sql: `DELETE from "${event_name}_${title}" WHERE voter = ?;`,
      args: [id],
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
