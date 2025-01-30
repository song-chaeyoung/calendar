"use client";

import React from "react";
import style from "./page.module.css";
import Calendar from "@/components/calendar";
import useCount from "@/store/store";

const Page = () => {
  const { count, inc } = useCount();

  return (
    <section className={style.container}>
      <Calendar />
      {/* <button onClick={() => inc()}>inc</button>
      <p>{count}</p> */}
    </section>
  );
};

export default Page;
