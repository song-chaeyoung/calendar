import React from "react";
import style from "../styles/calendar.module.css";
import { holidayItemType } from "@/services/holiday";

interface propsType {
  date: Date[][];
  currentDate: Date;
  getHolidayInfo: (day: Date) => holidayItemType | undefined;
}

const MonthCalendar = ({ date, currentDate, getHolidayInfo }: propsType) => {
  return (
    <tbody>
      {date.map((week: Date[], idx) => (
        <tr key={idx}>
          {week.map((day: Date, idx) => {
            const holidayInfo = getHolidayInfo(day);
            return (
              <td
                key={idx}
                className={`${style.day} ${
                  currentDate.getMonth() !== day.getMonth() && `${style.grey}`
                } ${holidayInfo ? style.holiday : ""} ${
                  `${day.getFullYear()}${day.getMonth()}${day.getDate()}` ===
                  `${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}`
                    ? style.today
                    : ""
                }`}
              >
                <span>{new Date(day).getDate()}</span>
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
