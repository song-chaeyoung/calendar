const holidayApiKey = process.env.NEXT_PUBLIC_HOLIDAY_API;

export interface resType {
  response: {
    body: holidayType;
    header: {
      resultCode: string;
      resultMsg: string;
    };
  };
}
interface holidayType {
  items: {
    item: holidayItemType[];
  };
  numOfRows: number;
  pageNo: number;
  totalCount: number;
}

export interface holidayItemType {
  dateKind: string;
  dateName: string;
  isHoliday: string;
  locdate: number;
  seq: number;
}

export const getHolidayApi = async (
  month: string,
  date: string
): Promise<resType> => {
  try {
    const res = await fetch(
      `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${holidayApiKey}&solYear=${month}&solMonth=${date}&_type=json`
    );
    const json: resType = await res.json();

    if (!res.ok) throw new Error("오류 발생");
    return json;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
