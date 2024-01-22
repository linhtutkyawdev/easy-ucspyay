import { NextResponse } from "next/server";
import { getEvents } from "../server";

export const GET = async () => {
  return NextResponse.json((await getEvents()) || "");
};
