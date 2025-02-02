import React from "react";
import style from "../styles/schedule.module.css";

const Schedule = () => {
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
  };

  return (
    <section className={style.container}>
      <div className={style.mainBox}>
        <p className={style.title}>일정 추가하기</p>
        <form className={style.form} onSubmit={submitHandler}>
          <div className={style.input_title}>
            <label htmlFor="input_title">일정 제목</label>
            <input type="text" id="input_title" />
          </div>
          <div>
            <label htmlFor="input_date">일정 날짜</label>
            <input type="text" id="input_date" />
          </div>
          <div>
            <label htmlFor="input_time">일정 시간</label>
            <input type="text" id="input_time" />
          </div>
          <div>
            <label htmlFor="input_content">일정 내용</label>
            <textarea name="input_content" id="input_content"></textarea>
          </div>
          <button className={style.submit_btn}>일정 추가</button>
        </form>
      </div>
    </section>
  );
};

export default Schedule;
