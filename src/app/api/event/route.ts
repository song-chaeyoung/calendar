import { eventType } from "@/types/event";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface bodyType {
  value: eventType;
}

let event: eventType[] = [];

export const GET = async () => {
  return NextResponse.json(event, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  // const url = new URL(req.url);
  // const calendar = url.searchParams.get("calendar") || "";

  try {
    const body: bodyType = await req.json();

    if (!body || !body.value) {
      return NextResponse.json({ error: "값이 필요합니다." }, { status: 400 });
    }

    const addIdEvent = { ...body.value, id: Date.now() };

    event.push(addIdEvent);
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

export const PATCH = async (req: NextRequest) => {
  try {
    const body: bodyType = await req.json();

    const index = event.findIndex((e) => e.id === body.value.id);

    if (index !== -1) {
      event[index] = body.value;
      revalidatePath("/calendar");
      return NextResponse.json(
        { message: "저장 성공", data: event },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "이벤트를 찾을 수 없습니다" },
        { status: 404 }
      );
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "서버 PATCH 오류 발생" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const body: bodyType = await req.json();

    if (!body || !body.value) {
      return NextResponse.json({ error: "값이 필요합니다." }, { status: 400 });
    }

    event = event.filter((item) => item.id !== body.value.id);
    console.log(event);
    return NextResponse.json(
      { message: "삭제 성공", data: event },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "서버 오류 발생, 삭제 안됨" },
      { status: 500 }
    );
  }
};
