import { getSecrets } from "@/app/api/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json(await getSecrets());
};
