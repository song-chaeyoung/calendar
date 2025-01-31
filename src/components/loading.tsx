import React from "react";
import style from "../styles/loading.module.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <section className={style.container}>
      <AiOutlineLoading3Quarters className={style.loading} size={30} />
    </section>
  );
};

export default Loading;
