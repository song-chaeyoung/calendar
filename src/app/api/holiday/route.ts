import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const holidayApiKey = process.env.HOLIDAY_API;

  if (!holidayApiKey) {
    return NextResponse.json(
      { error: "환경 변수가 없습니다." },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const year = url.searchParams.get("year") || "0";
  const month = url.searchParams.get("month") || "0";

  let prevMonth: string | number = Number(month) - 1;
  let nextMonth: string | number = Number(month) + 1;
  const prevYear = prevMonth == 0 ? Number(year) - 1 : year;
  const nextYear = nextMonth == 13 ? Number(year) + 1 : year;

  prevMonth = prevMonth == 0 ? "12" : prevMonth.toString().padStart(2, "0");
  nextMonth = nextMonth == 13 ? "01" : nextMonth.toString().padStart(2, "0");

  try {
    const [lastHoliday, currentHoliday, nextHoliday] = await Promise.all([
      fetch(
        `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${holidayApiKey}&solYear=${prevYear}&solMonth=${prevMonth}&_type=json`
      ),
      fetch(
        `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${holidayApiKey}&solYear=${year}&solMonth=${month
          .toString()
          .padStart(2, "0")}&_type=json`
      ),
      fetch(
        `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${holidayApiKey}&solYear=${nextYear}&solMonth=${nextMonth}&_type=json`
      ),
    ]);

    const [lastJson, currentJson, nextJson] = await Promise.all([
      lastHoliday.json(),
      currentHoliday.json(),
      nextHoliday.json(),
    ]);

    const lastItems = lastJson.response.body.items.item || [];
    const currentItems = currentJson.response.body.items.item || [];
    const nextItems = nextJson.response.body.items.item || [];

    const holidayItems = [
      ...(Array.isArray(lastItems) ? lastItems : [lastItems]),
      ...(Array.isArray(currentItems) ? currentItems : [currentItems]),
      ...(Array.isArray(nextItems) ? nextItems : [nextItems]),
    ];

    return NextResponse.json({ holiday: holidayItems });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "공휴일 API 요청 실패" },
      { status: 500 }
    );
  }
};
