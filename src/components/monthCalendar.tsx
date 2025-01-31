import React from "react";
import style from "../styles/calendar.module.css";
import { holidayItemType } from "@/store/calendarStore";
import dayjs, { Dayjs } from "dayjs";

interface propsType {
  date: Dayjs[][];
  currentDate: Dayjs;
  getHolidayInfo: (day: Dayjs) => holidayItemType | undefined;
}

const MonthCalendar = ({ date, currentDate, getHolidayInfo }: propsType) => {
  return (
    <tbody>
      {date.map((week: Dayjs[], idx) => (
        <tr key={idx}>
          {week.map((day: Dayjs, idx) => {
            const holidayInfo = getHolidayInfo(day);
            return (
              <td
                key={idx}
                className={`${style.day} ${
                  currentDate.month() !== day.month() && `${style.grey}`
                } ${holidayInfo ? style.holiday : ""} ${
                  day.format("YYMMDD") === dayjs().format("YYMMDD")
                    ? style.today
                    : ""
                }`}
              >
                <span>{day.date()}</span>
                {holidayInfo && (
                  <span className={style.holidayName}>
                    {holidayInfo.dateName}
                  </span>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export default MonthCalendar;
