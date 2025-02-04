import { eventType } from "@/types/event";
import React from "react";
import style from "../styles/nowEvent.module.css";
import { IoMdTime } from "react-icons/io";
import { TbFileDescription } from "react-icons/tb";
import { FaUser } from "react-icons/fa";

const categoryArr: Record<string, string> = {
  10: "휴가",
  20: "출장",
  30: "외근",
  40: "연장근무",
};

interface props {
  nowEvent: eventType | undefined;
  setClose: (arg: boolean) => void;
}

const NowEvent = ({ nowEvent, setClose }: props) => {
  console.log(nowEvent);
  // const [startYear, startMonth, startDay] = nowEvent?.startDate.slice(2);
  const [startYear, startMonth, startDay] =
    nowEvent?.startDate.match(/.{1,2}/g) || [];
  // const [startYear, startMonth, startDay] = [
  //   ...Array(nowEvent?.startDate?.length / 2),
  // ].map((_, i) => nowEvent?.startDate.slice(i * 2, i * 2 + 2));

  // const [endYear, endMonth, endDay] = nowEvent?.startDate;
  const [endYear, endMonth, endDay] =
    nowEvent?.startDate.match(/.{1,2}/g) || [];
  return (
    <div className={style.container}>
      <span className={style.category}>
        {nowEvent?.category ? categoryArr[nowEvent?.category.toString()] : ""}
      </span>
      <h1 className={style.title}>{nowEvent?.title}</h1>
      <div className={style.desc}>
        <div className={style.user}>
          <FaUser size={18} color="grey" />
          <div>
            <p>대표자 : </p>
            <div>
              <p>유저 이름</p>
              <p>유저 이름</p>
              <p>유저 이름</p>
            </div>
          </div>
        </div>
        <div className={style.time}>
          <IoMdTime size={18} color="grey" />
          <p>
            20{startYear}년 {startMonth.toString().padStart(2, "0")}월{" "}
            {startDay}일 {nowEvent?.startTime}
          </p>
          <span>-</span>{" "}
          <p>
            {nowEvent?.endDate !== nowEvent?.startDate &&
              `20${endYear}년 ${endMonth}월 ${endDay}일 `}
            {nowEvent?.endTime}
          </p>
        </div>
        {/* <div>
          <p>{nowEvent?.startTime}</p>
          <p>{nowEvent?.endTime}</p>
        </div> */}
        {nowEvent?.content !== "" && (
          <div className={style.content}>
            <TbFileDescription size={18} color="grey" />
            <p>{nowEvent?.content}</p>
          </div>
        )}
      </div>
      <div className={style.btngroup}>
        <button className={style.edit}>수정</button>
        <button className={style.confirm} onClick={() => setClose(false)}>
          확인
        </button>
      </div>
    </div>
  );
};

export default NowEvent;
