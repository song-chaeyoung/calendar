"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import style from "../styles/calendar.module.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { getHolidayApi, holidayItemType } from "@/services/holiday";
import Loading from "./loading";

const dayName = ["일", "월", "화", "수", "목", "금", "토"];

const plusFrontZero = (num: number | string) => {
  num = Number(num) < 10 ? `0${num}` : num;
  return num;
};

const Calendar = () => {
  const [monthVersion, setMonthVersion] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holiday, setHoliday] = useState<holidayItemType[] | undefined>(
    undefined
  );
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = useMemo(
    () => new Date(year, month, 1),
    [year, month]
  );
  const startDay = useMemo(() => {
    const start = new Date(firstDayOfMonth);
    start.setDate(1 - firstDayOfMonth.getDay());
    return start;
  }, [firstDayOfMonth]);

  const lastDayOfMonth = useMemo(
    () => new Date(year, month + 1, 0),
    [year, month]
  );
  const endDay = useMemo(() => {
    const end = new Date(lastDayOfMonth);
    end.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));
    return end;
  }, [lastDayOfMonth]);

  const date = useMemo(() => {
    const weeks = [];
    let currentWeek = [];
    const currentDate = new Date(startDay);

    while (currentDate <= endDay) {
      currentWeek.push(new Date(currentDate));

      if (currentWeek.length === 7 || currentDate.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [startDay, endDay]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  }, [currentDate]);

  // holiday API
  const fetchHoliday = async () => {
    const holidayList = await getHolidayApi(
      `${currentDate.getFullYear()}`,
      `${plusFrontZero(currentDate.getMonth() + 1)}`
    );

    setHoliday(holidayList.response.body.items.item);
  };

  const getHolidayInfo = useCallback(
    (day: Date): holidayItemType | undefined => {
      if (!holiday || !Array.isArray(holiday)) return undefined;

      const formatDate = `${day.getFullYear()}${plusFrontZero(
        day.getMonth() + 1
      )}${plusFrontZero(day.getDate())}`;

      return holiday.find((item) => `${item.locdate}` === formatDate);
    },
    [holiday]
  );

  useEffect(() => {
    fetchHoliday();
  }, [currentDate]);

  return (
    <div className={style.container}>
      {/* <Loading /> */}
      <div className={style.header}>
        <span className={style.leftArr} onClick={() => handlePrevMonth()}>
          <IoIosArrowBack />
        </span>
        <h3>
          {currentDate.getFullYear()}.
          {plusFrontZero(currentDate.getMonth() + 1)}
        </h3>
        <span className={style.rightArr} onClick={() => handleNextMonth()}>
          <IoIosArrowForward />
        </span>
      </div>
      <table className={style.table}>
        <thead>
          <tr>
            {dayName.map((it, idx) => (
              <td key={idx}>{it}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {date.map((week: Date[], idx) => (
            <tr key={idx}>
              {week.map((day: Date, idx) => {
                const holidayInfo = getHolidayInfo(day);
                return (
                  <td
                    key={idx}
                    className={`${style.day} ${
                      currentDate.getMonth() !== day.getMonth() &&
                      `${style.grey}`
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
      </table>
    </div>
  );
};

export default Calendar;
