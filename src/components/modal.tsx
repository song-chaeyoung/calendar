import React, { ReactNode } from "react";
import style from "../styles/modal.module.css";

interface propsType {
  setClose: (arg: boolean) => void;
  children: ReactNode;
  title?: string;
}

const Modal = ({ setClose, children, title }: propsType) => {
  return (
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
