import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import style from "../styles/schedule.module.css";
import { eventType } from "@/types/event";

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

interface uiProps {
  edit: boolean;
  postApi: (formData: FormData) => void;
  patchApi: (formData: FormData) => void;
  nowEvent?: eventType;
}

export const ScheduleForm = ({
  edit,
  postApi,
  patchApi,
  nowEvent,
}: uiProps) => {
  const [viewStartTime, setViewStartTime] = useState<timeType>(upcomingTime);
  const [viewEndTime, setViewEndTime] = useState<timeType>(upcoimgNextTime);
  const [timeTableActive, setTimeTableActive] = useState<timeTableType>({
    start: false,
    end: false,
  });

  const [formState, setFormState] = useState<eventType>({
    category: "",
    title: "",
    content: "",
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
    startTime: upcomingTime.time,
    endTime: upcoimgNextTime.time,
    id: nowEvent?.id,
  });

  useEffect(() => {
    const timeIdx = timeSlots.findIndex(
      (it) => it.calculate === viewStartTime.calculate
    );
    const nextTime = timeSlots[(timeIdx + 1) % timeSlots.length];

    setFormState((prev) => ({
      ...prev,
      endTime: nextTime.time,
    }));
  }, [viewStartTime]);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      startTime: viewStartTime.time,
    }));
  }, [viewStartTime]);
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      endTime: viewEndTime.time,
    }));
  }, [viewEndTime]);

  useEffect(() => {
    if (nowEvent) {
      setFormState((prev) => ({
        ...prev,
        category: nowEvent.category,
        title: nowEvent.title,
        content: nowEvent.content,
        startDate: `20${nowEvent.startDate.slice(
          0,
          2
        )}-${nowEvent.startDate.slice(2, 4)}-${nowEvent.startDate.slice(4, 6)}`,
        endDate: `20${nowEvent.endDate.slice(0, 2)}-${nowEvent.endDate.slice(
          2,
          4
        )}-${nowEvent.endDate.slice(4, 6)}`,
        startTime: nowEvent.startTime,
        endTime: nowEvent.endTime,
      }));
    }
  }, [nowEvent]);

  return (
    <form className={style.form} action={edit ? patchApi : postApi}>
      <div>
        <label htmlFor="category" id="category">
          카테고리
        </label>
        <select
          name="category"
          id="category"
          value={formState.category}
          required
          className={style.select}
          onChange={(e) => {
            setFormState((prev) => ({
              ...prev,
              category: e.target.value,
            }));
          }}
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
        <input
          type="text"
          id="input_title"
          name="title"
          value={formState.title}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          required
        />
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
            value={formState.startDate}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                startDate: e.target.value,
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
            value={formState.endDate}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                endDate: e.target.value,
              }))
            }
            min={formState.startDate}
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
            value={formState.startTime}
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
                    setViewStartTime(item);
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
            value={formState.endTime}
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
                  onClick={async () => {
                    setViewEndTime(item);
                    setTimeTableActive((prev) => ({
                      ...prev,
                      end: !prev.end,
                    }));
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
        <textarea
          name="content"
          id="input_content"
          value={formState.content}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              content: e.target.value,
            }))
          }
        ></textarea>
      </div>
      <button className={style.submit_btn}>
        일정 {edit ? "수정" : "추가"}
      </button>
    </form>
  );
};

export default ScheduleForm;
