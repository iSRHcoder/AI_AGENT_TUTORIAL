import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const apiResponse = await fetch(`${BACKEND_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await apiResponse.json();

    return NextResponse.json(data, { status: apiResponse.status });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        message: "Some error occured",
        error: String(err),
      },
      { status: 500 },
    );
  }
};
