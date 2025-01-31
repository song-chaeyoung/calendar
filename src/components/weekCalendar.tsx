import React from "react";
import { holidayItemType } from "@/store/calendarStore";
import style from "../styles/calendar.module.css";
import dayjs, { Dayjs } from "dayjs";

interface propsType {
  currentDate: Dayjs;
  currenWeek: Dayjs[];
  getHolidayInfo: (day: Dayjs) => holidayItemType | undefined;
}

const WeekCalendar = ({
  currentDate,
  currenWeek,
  getHolidayInfo,
}: propsType) => {
  return (
    <tbody>
      <tr>
        {currenWeek.map((day: Dayjs, idx) => {
          const holidayInfo = getHolidayInfo(day);

          return (
            <td
              key={idx}
              className={`${style.day} ${style.weekDay} ${
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
    </tbody>
  );
};

export default WeekCalendar;
