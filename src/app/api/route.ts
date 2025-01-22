import { NextResponse } from "next/server";
export const revalidate = 0;

export const GET = async () => {
  return NextResponse.json({
    message: "Hello World From Easy UCSP!!!",
  });
};
