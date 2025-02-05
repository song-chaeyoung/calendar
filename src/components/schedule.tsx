import React, { useEffect, useState } from "react";
import style from "../styles/schedule.module.css";
import dayjs from "dayjs";
import { useEventStore } from "@/store/calendarStore";
import Loading from "./loading";
import { fontTest } from "@/app/layout";

interface props {
  setClose: (arg: boolean) => void;
}

interface timeType {
  time: string;
  calculate: number;
}

interface timeTableType {
  start: boolean;
  end: boolean;
}

// TIME SETTING
const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hours24 = Math.floor(i / 2);
  const strHours24 = String(hours24).padStart(2, "0");
  const hours12 = String(hours24 % 12 === 0 ? 12 : hours24 % 12);
  const minutes = i % 2 === 0 ? "00" : "30";
  const period = hours24 < 12 ? "오전" : "오후";

  return {
    time: `${strHours24}:${minutes}`,
    timetable: `${period} ${hours12}:${minutes}`,
    calculate: i * 30,
  };
});

const now = new Date();
const nowMinutes = now.getHours() * 60 + now.getMinutes();

const upcomingIndex = timeSlots.findIndex(
  (slot) => slot.calculate >= nowMinutes
);
const upcomingTime = timeSlots[upcomingIndex] || timeSlots[0];
const upcoimgNextTime = timeSlots[(upcomingIndex + 1) % timeSlots.length];

const Schedule = ({ setClose }: props) => {
  const { setConfirm, fetchEvent } = useEventStore();
  const [edit, setEdit] = useState<boolean>(true);

  const postApi = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());

    if (data) {
      const [startYear, startMonth, startDay] = String(data.startDate).split(
        "-"
      );
      const [endYear, endMonth, endDay] = String(data.endDate).split("-");
      data.startDate = `${startYear.slice(2)}${startMonth}${startDay}`;
      data.endDate = `${endYear.slice(2)}${endMonth}${endDay}`;
    }

    try {
      const res = await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: data }),
      });

      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      const result = await res.json();
      setClose(false);
      setConfirm(true);

      useEventStore.getState().fetchEvent();

      return result;
    } catch (err) {
      console.error(err);
    }

    return data;
  };

  const getApi = async () => {
    if (edit) fetchEvent();
  };

  return (
    <>
      <UiSchedule edit={edit} postApi={postApi} getApi={getApi} />
    </>
  );
};

interface uiProps {
  edit: boolean;
  postApi: (formData: FormData) => void;
  getApi: () => void;
}

export const UiSchedule = ({ edit, postApi, getApi }: uiProps) => {
  const [time, setTime] = useState<timeType>(upcomingTime);
  const [endTime, setEndTime] = useState<timeType>(upcoimgNextTime);
  // const { loading } = useEventStore();
  const [timeTableActive, setTimeTableActive] = useState<timeTableType>({
    start: false,
    end: false,
  });
  const [date, setDate] = useState({
    start: `${dayjs().format("YYYY-MM-DD")}`,
    end: `${dayjs().format("YYYY-MM-DD")}`,
  });

  useEffect(() => {
    const timeIdx = timeSlots.findIndex(
      (it) => it.calculate === time.calculate
    );
    const nextTime = timeSlots[(timeIdx + 1) % timeSlots.length];

    setEndTime(nextTime);
  }, [time]);

  useEffect(() => {
    const test = getApi();
    console.log(test);
  }, [edit]);

  return (
    <form className={style.form} action={postApi}>
      {/* {loading && <Loading />} */}

      <div>
        <label htmlFor="category">카테고리</label>
        <select
          name="category"
          id="category"
          defaultValue={""}
          required
          className={style.select}
        >
          <option value="" disabled>
            카테고리를 선택해주세요
          </option>
          <option value="10">휴가</option>
          <option value="20">출장</option>
          <option value="30">외근</option>
          <option value="40">연장근무</option>
        </select>
      </div>
      <div className={style.input_title}>
        <label htmlFor="input_title">일정 제목</label>
        <input type="text" id="input_title" name="title" required />
      </div>
      <div>
        <label htmlFor="input_date">일정 날짜</label>
        <div className={style.dategroup}>
          <p>시작날짜</p>
          <input
            type="date"
            id="input_date1"
            name="startDate"
            required
            value={date.start}
            onChange={(e) =>
              setDate((prev) => ({
                ...prev,
                start: e.target.value,
              }))
            }
            // max={date.end}
          />
          <p>종료날짜</p>
          <input
            type="date"
            id="input_date2"
            name="endDate"
            required
            value={date.end}
            onChange={(e) =>
              setDate((prev) => ({
                ...prev,
                end: e.target.value,
              }))
            }
            min={date.start}
          />
        </div>
      </div>
      <div className={style.time}>
        <label htmlFor="startTime">일정 시간</label>
        <div>
          <p>시작시간</p>
          <input
            type="time"
            id="input_time"
            name="startTime"
            value={time.time}
            readOnly
            required
            onClick={() =>
              setTimeTableActive((prev) => ({ ...prev, start: !prev.start }))
            }
          />
          {timeTableActive.start && (
            <ul className={style.timetable}>
              {timeSlots.map((item) => (
                <li
                  key={item.calculate}
                  onClick={() => {
                    setTime(item);
                    setTimeTableActive((prev) => ({
                      ...prev,
                      start: !prev.start,
                    }));
                  }}
                >
                  {item.timetable}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p>종료시간</p>
          <input
            type="time"
            id="input_time"
            name="endTime"
            value={endTime.time}
            readOnly
            required
            onClick={() =>
              setTimeTableActive((prev) => ({ ...prev, end: !prev.end }))
            }
          />
          {timeTableActive.end && (
            <ul className={style.timetable}>
              {timeSlots.map((item) => (
                <li
                  key={item.calculate}
                  onClick={() => {
                    setEndTime(item);
                    setTimeTableActive((prev) => ({ ...prev, end: !prev.end }));
                  }}
                >
                  {item.timetable}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="input_content">일정 내용</label>
        <textarea name="content" id="input_content"></textarea>
      </div>
      <button className={style.submit_btn}>
        일정 {edit ? "수정" : "추가"}
      </button>
    </form>
  );
};

export default Schedule;
