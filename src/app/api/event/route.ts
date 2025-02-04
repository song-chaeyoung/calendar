import { eventType } from "@/types/event";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

interface bodyType {
  value: eventType;
}

const event: eventType[] = [];

export const GET = async () => {
  return NextResponse.json(event, { status: 200 });
};

export const POST = async (req: Request) => {
  // const url = new URL(req.url);
  // const calendar = url.searchParams.get("calendar") || "";

  try {
    const body: bodyType = await req.json(); // JSON 데이터 파싱
    console.log(body); // 콘솔 확인

    if (!body || !body.value) {
      return NextResponse.json({ error: "값이 필요합니다." }, { status: 400 });
    }

    event.push(body.value);
    revalidatePath("/calendar");
    return NextResponse.json(
      { message: "저장 성공", data: event },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
  // return NextResponse.json(
  //   { error: "지원하지 않는 메서드입니다." },
  //   { status: 405 }
  // );
};
