import React, { ReactNode } from "react";
import style from "../styles/modal.module.css";

interface propsType {
  setClose: (arg: boolean) => void;
  title: string;
  children: ReactNode;
}

const Modal = ({ setClose, title, children }: propsType) => {
  return (
    // <section onClick={() => setClose(false)} className={style.container}>
    <div className={style.container}>
      <div onClick={(e) => e.stopPropagation()} className={style.mainBox}>
        <div className={style.title}>
          <p>{title}</p>
          <p onClick={() => setClose(false)}>
            <span>닫기</span> X
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
