"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import style from "../styles/calendar.module.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import MonthCalendar from "./monthCalendar";
import WeekCalendar from "./weekCalendar";
import {
  holidayItemType,
  useCalendarUiStore,
  useEventStore,
  useHolidayStore,
} from "@/store/calendarStore";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import Schedule from "./schedule";
// import Loading from "./loading";

const dayName = ["일", "월", "화", "수", "목", "금", "토"];

export const plusFrontZero = (num: number | string) => {
  num = Number(num) < 10 ? `0${num}` : num;
  return num;
};

const isToday = (currDay: Dayjs) => {
  return currDay.isSame(dayjs(), "day");
};

const Calendar = () => {
  dayjs.locale("ko");
  const { holiday, fetchHoliday } = useHolidayStore();
  const { isMonthView, setIsMonthView } = useCalendarUiStore();
  const { event, fetchEvent } = useEventStore();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [addEvent, setAddEvent] = useState<boolean>(false);

  const year = currentDate.year();
  const month = currentDate.month() + 1;

  const firstDayOfMonth = useMemo(
    () =>
      dayjs()
        .year(year)
        .month(month - 1)
        .startOf("month"),
    [year, month]
  );
  const startDay = useMemo(() => {
    return firstDayOfMonth.startOf("week");
  }, [firstDayOfMonth]);

  const lastDayOfMonth = useMemo(
    () =>
      dayjs()
        .year(year)
        .month(month - 1)
        .endOf("month"),
    [year, month]
  );
  const endDay = useMemo(() => {
    return lastDayOfMonth.endOf("week");
  }, [lastDayOfMonth]);

  const date = useMemo(() => {
    const weeks = [];
    let currentWeek = [];
    let currentDate = startDay;

    while (currentDate.isBefore(endDay || currentDate.isSame(endDay, "day"))) {
      currentWeek.push(currentDate);

      if (currentWeek.length === 7 || currentDate.day() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate = currentDate.add(1, "day");
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [startDay, endDay]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => prev.subtract(1, "month"));
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => prev.add(1, "month"));
  }, [currentDate]);

  // Week Calendar
  const currentWeekIndex = date.findIndex((week) =>
    week.some((day) => day.isSame(currentDate, "day"))
  );

  const currenWeek = date[currentWeekIndex] || date[0];

  const handlePrevWeek = useCallback(() => {
    setCurrentDate((prev) => prev.subtract(1, "week"));
  }, [currentDate]);
  const handleNextWeek = useCallback(() => {
    setCurrentDate((prev) => prev.add(1, "week"));
  }, [currentDate]);

  // holiday
  const getHolidayInfo = useCallback(
    (day: Dayjs): holidayItemType | undefined => {
      if (!holiday || !Array.isArray(holiday)) return undefined;

      const formatDate = day.format("YYYYMMDD");

      return holiday.find((item) => `${item.locdate}` === formatDate);
    },
    [holiday]
  );

  useEffect(() => {
    const year = currentDate.year();
    const month = currentDate.month() + 1;

    fetchHoliday(year, month);
  }, [currentDate]);

  useEffect(() => {
    fetchEvent();
    console.log(event);
  }, []);

  return (
    <div className={style.container}>
      {addEvent && <Schedule setAddEvent={setAddEvent} />}
      <div className={style.header}>
        <div className={style.addBtn}>
          <button onClick={() => setAddEvent(true)}>일정 추가하기</button>
        </div>
        <div className={style.headerCenter}>
          <span
            className={style.leftArr}
            onClick={
              isMonthView ? () => handlePrevMonth() : () => handlePrevWeek()
            }
          >
            <IoIosArrowBack />
          </span>
          <h3>
            {currentDate.year()}.{plusFrontZero(currentDate.month() + 1)}
            {!isMonthView && ` ${currentWeekIndex + 1}주차`}
          </h3>
          <span
            className={style.rightArr}
            onClick={
              isMonthView ? () => handleNextMonth() : () => handleNextWeek()
            }
          >
            <IoIosArrowForward />
          </span>
          <button
            disabled={isToday(currentDate)}
            className={`${style.todayBtn} ${
              isToday(currentDate) ? style.disable : ""
            }`}
            onClick={() => setCurrentDate(dayjs())}
          >
            오늘
          </button>
        </div>
        <div className={style.changeBtn}>
          <button
            className={`${isMonthView && style.active}`}
            onClick={() => setIsMonthView(true)}
          >
            월간
          </button>
          <button
            className={`${!isMonthView && style.active}`}
            onClick={() => setIsMonthView(false)}
          >
            주간
          </button>
        </div>
      </div>
      <table className={style.table}>
        <thead>
          <tr>
            {dayName.map((it, idx) => (
              <td key={idx}>{it}</td>
            ))}
          </tr>
        </thead>
        {isMonthView ? (
          <MonthCalendar
            date={date}
            currentDate={currentDate}
            getHolidayInfo={getHolidayInfo}
          />
        ) : (
          <WeekCalendar
            currentDate={currentDate}
            currenWeek={currenWeek}
            getHolidayInfo={getHolidayInfo}
          />
        )}
      </table>
    </div>
  );
};

export default Calendar;
