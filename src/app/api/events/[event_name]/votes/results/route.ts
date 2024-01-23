import { getAllResults } from "@/app/api/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  {
    params: { event_name },
  }: {
    params: {
      event_name: string;
    };
  }
) => {
  return NextResponse.json((await getAllResults(event_name)) || "");
};
