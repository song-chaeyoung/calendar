import React, { useEffect } from "react";
import style from "../styles/calendar.module.css";
import { holidayItemType, useNowEventStore } from "@/store/calendarStore";
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
  useEffect(() => {
    console.log(event);
    if (event !== undefined) {
      // console.log(event.map((it) => it.startDate));
    }
  }, [event]);

  return (
    <>
      <tbody>
        {date.map((week: Dayjs[], idx) => (
          <tr key={idx}>
            {week.map((day: Dayjs, idx) => {
              const holidayInfo = getHolidayInfo(day);
              const dayKey = day.format("YYMMDD");
              const dayEvents =
                event?.filter(
                  (item) => item.startDate <= dayKey && dayKey <= item.endDate
                ) || [];
              const positions = new Map();

              const sortedEvents = [...(event || [])].sort((a, b) =>
                a.startDate.localeCompare(b.startDate)
              );

              sortedEvents.forEach((currentEvent) => {
                const overlappingEvents = sortedEvents.filter(
                  (otherEvent) =>
                    currentEvent !== otherEvent &&
                    currentEvent.startDate <= otherEvent.endDate &&
                    currentEvent.endDate >= otherEvent.startDate
                );

                // 겹치는 이벤트들의 위치를 확인하여 빈 위치 찾기
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
                    {dayEvents.map((item) => {
                      const isStart = item.startDate === dayKey;
                      const isEnd = item.endDate === dayKey;
                      const isMultiDay = item.startDate !== item.endDate;
                      const eventLength =
                        dayjs(item.endDate).diff(dayjs(item.startDate), "day") +
                        1;

                      return (
                        <div
                          key={item.title}
                          className={style.eventWrapper}
                          style={{
                            top: `${positions.get(item) * 24 + 36}px`,
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
                            style={{
                              gridColumn:
                                isStart && isMultiDay
                                  ? `span ${eventLength}`
                                  : undefined,
                            }}
                          >
                            {isStart && `${item.title}`}
                          </div>
                        </div>
                      );
                    })}
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
