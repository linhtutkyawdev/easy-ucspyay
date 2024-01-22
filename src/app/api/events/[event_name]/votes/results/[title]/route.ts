import { getResults } from "@/app/api/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  {
    params: { event_name, title },
  }: {
    params: {
      event_name: string;
      title: string;
    };
  }
) => {
  return NextResponse.json((await getResults(event_name, title)) || "");
};
