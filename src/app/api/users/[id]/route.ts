import { getUser } from "@/app/api/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  {
    params: { id },
  }: {
    params: {
      id: string;
    };
  }
) => {
  return NextResponse.json(await getUser(id));
};
