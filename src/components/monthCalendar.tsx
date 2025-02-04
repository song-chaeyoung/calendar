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
                      const category = item.category;

                      return (
                        <div
                          key={item.title}
                          className={style.eventWrapper}
                          style={{
                            top: `${index * 22 + 36}px`,
                            left: "0",
                            zIndex: "10",
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
