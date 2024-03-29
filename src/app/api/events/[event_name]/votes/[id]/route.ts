import { getVotes } from "@/app/api/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  {
    params: { event_name, id },
  }: {
    params: {
      event_name: string;
      id: string;
    };
  }
) => {
  return NextResponse.json((await getVotes(event_name, id)) || "");
};
