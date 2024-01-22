import { NextResponse } from "next/server";
import { getUsers } from "../server";

export const GET = async () => {
  return NextResponse.json((await getUsers()) || "");
};
