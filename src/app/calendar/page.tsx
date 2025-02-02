"use client";

import React from "react";
import style from "./page.module.css";
import Calendar from "@/components/calendar";

const Page = () => {
  return (
    <section className={style.container}>
      <Calendar />
    </section>
  );
};

export default Page;
