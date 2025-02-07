import React, { useEffect } from "react";
import style from "../styles/calendar.module.css";
import {
  allEventStore,
  holidayItemType,
  useNowEventStore,
} from "@/store/calendarStore";
import dayjs, { Dayjs } from "dayjs";
import { eventType } from "@/types/event";

interface propsType {
  date: Dayjs[][];
  currentDate: Dayjs;
  getHolidayInfo: (day: Dayjs) => holidayItemType | undefined;
  event: eventType[] | undefined;
}

const MonthCalendar = ({
  date,
  currentDate,
  getHolidayInfo,
  event,
}: propsType) => {
  const { setModal, setNowEvent } = useNowEventStore();
  const { setAllEvent, setShowAllEvent, setViewDay } = allEventStore();

  useEffect(() => {
    if (event !== undefined) {
      // console.log(event.map((it) => it.startDate));
    }
  }, [event]);

  const positions = new Map();

  const sortedEvents = [...(event || [])].sort((a, b) =>
    // a.startTime.localeCompare(b.startTime)
    {
      const durationA = dayjs(a.endDate).diff(dayjs(a.startDate), "day");
      const durationB = dayjs(b.endDate).diff(dayjs(b.startDate), "day");

      if (durationA !== durationB) {
        return durationB - durationA; // 길이가 긴 순서대로 정렬
      }
      return a.startTime.localeCompare(b.startTime);
    }
  );

  sortedEvents.forEach((currentEvent) => {
    const overlappingEvents = sortedEvents.filter((otherEvent) => {
      if (currentEvent === otherEvent) return;
      return (
        currentEvent.startDate <= otherEvent.endDate &&
        currentEvent.endDate >= otherEvent.startDate
      );
    });

    let position = 0;
    let positionTaken = true;
    while (positionTaken) {
      positionTaken = overlappingEvents.some(
        (event) => positions.get(event) === position
      );
      if (positionTaken) position++;
    }

    positions.set(currentEvent, position);
  });

  console.log(positions);

  return (
    <>
      <tbody>
        {date.map((week: Dayjs[], idx) => (
          <tr key={idx}>
            {week.map((day: Dayjs, idx) => {
              const holidayInfo = getHolidayInfo(day);
              const dayKey = day.format("YYMMDD");
              const dayEvents =
                sortedEvents?.filter(
                  (item) => item.startDate <= dayKey && dayKey <= item.endDate
                ) || [];

              console.log(sortedEvents);

              const viewEvent =
                dayEvents.length >= 3 ? dayEvents.slice(0, 2) : dayEvents;
              console.log(dayEvents, viewEvent);
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
                  style={{ position: "relative" }}
                >
                  <span>{day.date()}</span>
                  {holidayInfo && (
                    <span className={style.holidayName}>
                      {holidayInfo.dateName}
                    </span>
                  )}
                  <div className={style.eventContainer}>
                    {viewEvent.map((item) => {
                      const isStart = item.startDate === dayKey;
                      const isEnd = item.endDate === dayKey;
                      const isMultiDay = item.startDate !== item.endDate;
                      // const eventLength =
                      //   dayjs(item.endDate).diff(dayjs(item.startDate), "day") +
                      //   1;

                      // console.log(item.title, isStart, isMultiDay, isEnd);

                      return (
                        <div
                          key={item.id}
                          className={style.eventWrapper}
                          style={{
                            top: `${positions.get(item) * 24}px`,
                          }}
                        >
                          <div
                            onClick={() => {
                              setModal(true);
                              setNowEvent(item);
                            }}
                            className={`${style.eventBox} ${
                              style[`category${item.category}`]
                            } ${isStart ? style.start : ""} ${
                              isEnd ? style.end : ""
                            } ${isMultiDay ? style.multiDay : style.singleDay}`}
                          >
                            {(isStart || day.day() === 0) && `${item.title}`}
                          </div>
                        </div>
                      );
                    })}
                    {dayEvents.length >= 3 && (
                      <div
                        className={style.plusBtn}
                        onClick={() => {
                          setViewDay(day.format("YYMMDD"));
                          setAllEvent(dayEvents);
                          setShowAllEvent(true);
                        }}
                      >
                        +
                      </div>
                    )}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </>
  );
};

export default MonthCalendar;
