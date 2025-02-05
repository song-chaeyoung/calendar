import React from "react";
import { holidayItemType, useNowEventStore } from "@/store/calendarStore";
import style from "../styles/calendar.module.css";
import dayjs, { Dayjs } from "dayjs";
import { eventType } from "@/types/event";

interface propsType {
  currentDate: Dayjs;
  currenWeek: Dayjs[];
  getHolidayInfo: (day: Dayjs) => holidayItemType | undefined;
  event: eventType[] | undefined;
}

const WeekCalendar = ({
  currentDate,
  currenWeek,
  getHolidayInfo,
  event,
}: propsType) => {
  const { setModal, setNowEvent } = useNowEventStore();

  const weekPositions = new Map();
  const allWeekEvents = event
    ?.filter((e) => {
      const eventStart = e.startDate;
      const eventEnd = e.endDate;
      return currenWeek.some((day) => {
        const dayKey = day.format("YYMMDD");
        return eventStart <= dayKey && dayKey <= eventEnd;
      });
    })
    .sort((a, b) => {
      // 시작 날짜가 다르면 날짜순
      if (a.startDate !== b.startDate) {
        return a.startDate.localeCompare(b.startDate);
      }
      // 시작 시간이 다르면 시간순
      if (a.startTime !== b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });

  // sortedWeekEvents?.forEach((currentEvent) => {
  //   const overlappingEvents = sortedWeekEvents.filter((otherEvent) => {
  //     if (currentEvent === otherEvent) return false;

  //     const dateOverlap =
  //       currentEvent.startDate <= otherEvent.endDate &&
  //       currentEvent.endDate >= otherEvent.startDate;

  //     const timeOverlap =
  //       currentEvent.startTime <= otherEvent.endTime &&
  //       currentEvent.endTime >= otherEvent.startTime;

  //     const existingPosition = weekPositions.get(otherEvent);

  //     return dateOverlap && (timeOverlap || existingPosition !== undefined);
  //     // return dateOverlap && timeOverlap;
  //   });

  //   console.log(currentEvent, overlappingEvents);

  //   let position = 0;
  //   let positionTaken = true;
  //   while (positionTaken) {
  //     positionTaken = overlappingEvents.some(
  //       (event) => weekPositions.get(event) === position
  //     );

  //     // overlappingEvents.forEach((lappingEvent) => {
  //     //   if (currentEvent.startTime >= lappingEvent.startTime) {
  //     //     const eventPosition = weekPositions.get(lappingEvent);
  //     //     if (eventPosition !== undefined) {
  //     //       weekPositions.set(event, eventPosition + 1);
  //     //       position = eventPosition;
  //     //     }

  //     //     // console.log(test);
  //     //     // position = test;
  //     //     // weekPositions.set(weekPositions);
  //     //   }
  //     // });
  //     if (positionTaken) position++;
  //   }

  //   weekPositions.set(currentEvent, position);
  // });
  console.log(weekPositions);

  allWeekEvents?.forEach((currentEvent) => {
    // 현재 이벤트와 시간이 겹치는 이벤트 찾기
    const overlappingEvents = allWeekEvents.filter((otherEvent) => {
      if (currentEvent === otherEvent) return false;

      const dateOverlap =
        currentEvent.startDate <= otherEvent.endDate &&
        currentEvent.endDate >= otherEvent.startDate;

      // 시간 겹침 확인 로직 수정
      const timeOverlap =
        (currentEvent.startTime < otherEvent.endTime &&
          currentEvent.endTime > otherEvent.startTime) ||
        currentEvent.startTime === otherEvent.startTime;

      return dateOverlap && timeOverlap;
    });

    const previousEvents = allWeekEvents.filter((otherEvent) => {
      if (currentEvent === otherEvent) return false;

      const dateOverlap =
        currentEvent.startDate <= otherEvent.endDate &&
        currentEvent.endDate >= otherEvent.startDate;

      return (
        dateOverlap &&
        otherEvent.endTime <= currentEvent.startTime &&
        weekPositions.has(otherEvent)
      );
    });

    let position =
      previousEvents.length > 0
        ? Math.max(...previousEvents.map((e) => weekPositions.get(e))) + 1
        : 0;

    while (overlappingEvents.some((e) => weekPositions.get(e) === position)) {
      position++;
    }

    weekPositions.set(currentEvent, position);
  });

  console.log(weekPositions);

  return (
    <tbody>
      <tr>
        {currenWeek.map((day: Dayjs, idx) => {
          const holidayInfo = getHolidayInfo(day);

          const dayKey = day.format("YYMMDD");
          const dayEvents =
            event?.filter(
              (item) => item.startDate <= dayKey && dayKey <= item.endDate
            ) || [];

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
              <div className={`${style.eventContainer} ${style.week}`}>
                {dayEvents.map((item) => {
                  const isStart = item.startDate === dayKey;
                  const isEnd = item.endDate === dayKey;
                  const isMultiDay = item.startDate !== item.endDate;
                  const eventLength =
                    dayjs(item.endDate).diff(dayjs(item.startDate), "day") + 1;

                  return (
                    <div
                      key={item.title}
                      className={style.eventWrapper}
                      style={{
                        top: `${weekPositions.get(item) * 60 + 36}px`,
                      }}
                    >
                      <div
                        onClick={() => {
                          setModal(true);
                          setNowEvent(item);
                        }}
                        className={`${style.eventBox} ${style.week} ${
                          style[`category${item.category}`]
                        } ${isStart ? style.start : ""} ${
                          isEnd ? style.end : ""
                        } ${isMultiDay ? style.multiDay : style.singleDay}`}
                        style={{
                          gridColumn:
                            isStart && isMultiDay
                              ? `span ${eventLength}`
                              : undefined,
                        }}
                      >
                        {isStart &&
                          `${item.title} ${item.startTime} -
                        ${item.endTime}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </td>
          );
        })}
      </tr>
    </tbody>
  );
};

export default WeekCalendar;
