import React from "react";
import style from "../styles/schedule.module.css";

const Schedule = () => {
  return (
    <section className={style.container}>
      <div className={style.mainBox}>
        <p>일정 추가하기</p>
        <form>
          <div className={style.input_title}>
            <label htmlFor="input_title">일정 제목</label>
            <input type="text" id="input_title" />
          </div>
          <div>
            <label htmlFor=""></label>
            <input type="text" />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Schedule;
