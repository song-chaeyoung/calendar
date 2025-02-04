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
  // const [nowEvent, setNowEvnent] = useState<eventType | undefined>(undefined);
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
              // let overEvent = false;
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

              // 위치 계산 로직 개선
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

              // event?.forEach((currentEvent) => {
              //   let position = 0;
              //   event?.forEach((otherEvent) => {
              //     // 두 이벤트가 겹치는지 확인
              //     if (
              //       currentEvent !== otherEvent &&
              //       currentEvent.startDate <= otherEvent.endDate &&
              //       currentEvent.endDate >= otherEvent.startDate
              //     ) {
              //       // 겹치는 이벤트 중 시작일이 더 빠른 이벤트가 위에 위치
              //       if (currentEvent.startDate > otherEvent.startDate) {
              //         position++;
              //       }
              //     }
              //   });
              //   positions.set(currentEvent, position);
              // });

              // dayEvents.forEach((currentEvent) => {
              //   let maxPosition = 0;
              //   // 현재 이벤트의 전체 기간 동안 필요한 최대 위치 찾기
              //   event?.forEach((otherEvent) => {
              //     if (
              //       otherEvent.startDate <= currentEvent.endDate &&
              //       otherEvent.endDate >= currentEvent.startDate &&
              //       otherEvent.startDate <= dayKey
              //     ) {
              //       maxPosition++;
              //     }
              //   });
              //   positions.set(currentEvent, maxPosition - 1);
              // });

              // const eventLevels: { [key: string]: number } = {};
              // dayEvents.forEach((item, index) => {
              //   const conflictingEvents = dayEvents.filter(
              //     (otherItem, otherIndex) =>
              //       otherIndex !== index &&
              //       item.startDate <= otherItem.endDate &&
              //       item.endDate >= otherItem.startDate
              //   );
              //   eventLevels[item.title] = conflictingEvents.length;
              // });
              // if (dayEvents.length > 3) {
              //   overEvent = true;
              // }
              // console.log(dayEvents.length);
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
                    {dayEvents.map((item, index) => {
                      const isStart = item.startDate === dayKey;
                      const isEnd = item.endDate === dayKey;
                      const isMultiDay = item.startDate !== item.endDate;
                      // const isSingleDay = item.startDate === item.endDate;
                      const eventLength =
                        dayjs(item.endDate).diff(dayjs(item.startDate), "day") +
                        1;
                      // const verticalPosition = positions[index] * 24 + 36;
                      const category = item.category;

                      return (
                        <div
                          key={item.title}
                          className={style.eventWrapper}
                          // style={{
                          //   top: `${index * 22 + 36}px`,
                          //   left: "0",
                          //   zIndex: "10",
                          // }}
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
                            // className={`${style.eventBox} ${style.category}  ${
                            //   category === "10"
                            //     ? style.category10
                            //     : category === "20"
                            //     ? style.category20
                            //     : category === "30"
                            //     ? style.category30
                            //     : category === "40" && style.category40
                            // }
                            // ${isStart ? style.start : ""} ${
                            //   isEnd ? style.end : ""
                            // } ${isMultiDay ? style.multiDay : style.singleDay}`}
                            // style={{
                            //   gridColumn:
                            //     isStart && isMultiDay
                            //       ? `span ${
                            //           dayjs(item.endDate).diff(
                            //             dayjs(item.startDate),
                            //             "day"
                            //           ) + 1
                            //         }`
                            //       : undefined,
                            // }}
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
