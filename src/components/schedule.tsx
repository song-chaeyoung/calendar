import React, { useState } from "react";
import style from "../styles/schedule.module.css";
import dayjs from "dayjs";

interface props {
  setAddEvent: (arg: boolean) => void;
}

const Schedule = ({ setAddEvent }: props) => {
  // const [state, setAction] = useActionState(submitHandler, null);
  const [category, setCategory] = useState();
  const [date, setDate] = useState({
    start: `${dayjs().format("YYYY-MM-DD")}`,
    end: `${dayjs().format("YYYY-MM-DD")}`,
  });

  // console.log(date.end - date.start);

  // useEffect(() => {
  //   console.log(state?.data);
  // }, [state]);

  const submitHandler = async (formData: FormData) => {
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
      setAddEvent(false);
      return result;
    } catch (err) {
      console.error(err);
    }

    return data;
  };

  return (
    <section onClick={() => setAddEvent(false)} className={style.container}>
      <div onClick={(e) => e.stopPropagation()} className={style.mainBox}>
        <div className={style.title}>
          <p>일정 추가하기</p>
          <p onClick={() => setAddEvent(false)}>
            <span>닫기</span> X
          </p>
        </div>
        <form className={style.form} action={submitHandler}>
          <div>
            <label htmlFor="category">카테고리</label>
            <select
              name="category"
              id="category"
              defaultValue={"selected"}
              required
            >
              <option value="selected" disabled>
                카테고리를 선택해주세요
              </option>
              <option value="opt1">휴가</option>
              <option value="opt2">출장</option>
              <option value="opt3">외근</option>
              <option value="opt4">연장근무</option>
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
                max={date.end}
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
          {/* <div>
            <label htmlFor="input_time">일정 시간</label>
            <input type="text" id="input_time" name="time" />
          </div> */}
          <div>
            <label htmlFor="input_content">일정 내용</label>
            <textarea name="content" id="input_content"></textarea>
          </div>
          <button className={style.submit_btn}>일정 추가</button>
        </form>
      </div>
    </section>
  );
};

export default Schedule;
