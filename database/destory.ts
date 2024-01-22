import { turso } from "@/lib/utils";
import { promises as fs } from "fs";

export async function init() {
  await turso.executeMultiple(
    await fs.readFile(process.cwd() + "/database/drop.sql", "utf8")
  );
}

init();
