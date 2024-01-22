import { getContestant } from "@/app/api/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  {
    params: { id, event_name },
  }: {
    params: {
      event_name: string;
      id: string;
    };
  }
) => {
  return NextResponse.json((await getContestant(event_name, id)) || "");
};
