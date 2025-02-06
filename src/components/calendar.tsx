"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import style from "../styles/calendar.module.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import MonthCalendar from "./monthCalendar";
import WeekCalendar from "./weekCalendar";
import {
  allEventStore,
  holidayItemType,
  useCalendarUiStore,
  useEventStore,
  useHolidayStore,
  useNowEventStore,
} from "@/store/calendarStore";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import Schedule from "./schedule";
import Modal from "./modal";
import NowEvent, { categoryArr } from "@/containers/nowEvent";

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
  const { allEvent, showAllEvent, setShowAllEvent, setViewDay, viewDay } =
    allEventStore();
  const { isMonthView, setIsMonthView } = useCalendarUiStore();
  const {
    event,
    fetchEvent,
    confirm,
    setConfirm,
    isCategoryView,
    setIsCategoryView,
  } = useEventStore();
  const { modal, setModal, nowEvent, setNowEvent } = useNowEventStore();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [addEvent, setAddEvent] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

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

  // EVENT
  useEffect(() => {
    fetchEvent();
  }, [isCategoryView]);

  // INIT
  useEffect(() => {
    if (!modal && !edit) setNowEvent(undefined);
  }, [modal, edit]);

  useEffect(() => {
    if (!showAllEvent) setViewDay("");
  }, [showAllEvent]);

  return (
    <div className={style.container}>
      {showAllEvent && (
        <Modal setClose={setShowAllEvent} title={viewDay + "의 일정"}>
          {allEvent.length > 0 ? (
            allEvent.map((item) => (
              <div
                key={item.id}
                className={style.allEvent}
                onClick={() => {
                  setShowAllEvent(false);
                  setNowEvent(item);
                  setModal(true);
                }}
              >
                <p className={style[`category${item?.category}`]}>
                  {item?.category ? categoryArr[item?.category.toString()] : ""}
                </p>
                <p>{item.title}</p>
                <p>
                  {item.startDate} {item.startTime} -{" "}
                  {item.startDate !== item.endDate && item.endDate}{" "}
                  {item.endTime}
                </p>
                <p>{item.content && item.content}</p>
              </div>
            ))
          ) : (
            <p>다시 시도해주세요.</p>
          )}
        </Modal>
      )}
      {addEvent && (
        <Modal setClose={setAddEvent} title="일정 추가하기">
          <Schedule setClose={setAddEvent} edit={edit} setEdit={setEdit} />
        </Modal>
      )}
      {edit && (
        <Modal setClose={setEdit} title="일정 수정하기">
          <Schedule setClose={setAddEvent} edit={edit} setEdit={setEdit} />
        </Modal>
      )}
      {confirm && (
        <Modal setClose={setConfirm} title="">
          <div className={style.confirm}>
            <p>등록되었습니다.</p>
            <button onClick={() => setConfirm(false)}>확인</button>
          </div>
        </Modal>
      )}
      {modal && (
        <Modal setClose={setModal} title={`${nowEvent?.title}`}>
          <NowEvent setClose={setModal} setEdit={setEdit} />
        </Modal>
      )}

      <div className={style.header}>
        <div className={style.addBtn}>
          <button onClick={() => setAddEvent(true)}>일정 추가하기</button>
        </div>
        <div className={style.date}>
          <h3>
            {currentDate.year()}년 {plusFrontZero(currentDate.month() + 1)}월
            {!isMonthView && ` ${currentWeekIndex + 1}주차`}
          </h3>
        </div>
        <div className={style.changeBtn}>
          <table>
            <tbody>
              <tr>
                <td
                  className={`${isMonthView && style.active}`}
                  onClick={() => setIsMonthView(true)}
                >
                  월간
                </td>
                <td
                  className={`${!isMonthView && style.active}`}
                  onClick={() => setIsMonthView(false)}
                >
                  주간
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={style.rightArea}>
          <select
            name="selected"
            id="selected"
            defaultValue={"all"}
            onChange={(e) => setIsCategoryView(e.target.value)}
          >
            <option value="all">모두 보기</option>
            <option value="10">휴가</option>
            <option value="20">출장</option>
            <option value="30">외근</option>
            <option value="40">연장근무</option>
          </select>
          <table className={style.rightBtn}>
            <tbody>
              <tr>
                <td
                  className={style.leftArr}
                  onClick={
                    isMonthView
                      ? () => handlePrevMonth()
                      : () => handlePrevWeek()
                  }
                >
                  <IoIosArrowBack size={20} />
                </td>
                <td
                  className={style.rightArr}
                  onClick={
                    isMonthView
                      ? () => handleNextMonth()
                      : () => handleNextWeek()
                  }
                >
                  <IoIosArrowForward size={20} />
                </td>
                <td>
                  <button
                    disabled={isToday(currentDate)}
                    className={`${style.todayBtn} ${
                      isToday(currentDate) ? style.disable : ""
                    }`}
                    onClick={() => setCurrentDate(dayjs())}
                  >
                    오늘
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
            event={event}
          />
        ) : (
          <WeekCalendar
            currentDate={currentDate}
            currenWeek={currenWeek}
            getHolidayInfo={getHolidayInfo}
            event={event}
          />
        )}
      </table>
    </div>
  );
};

export default Calendar;
