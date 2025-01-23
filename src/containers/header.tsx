"use client";

import React, { useState } from "react";
import style from "./header.module.css";
import Link from "next/link";

const Header = () => {
  const [xmark, setXmark] = useState(false);

  return (
    <header className={style.header}>
      <div className={style.headerLeft}>
        <Link href={"/"}>LOGO</Link>
      </div>
      <div className={style.headerCenter}></div>
      <div className={style.headerRight}>
        <button
          onClick={() => setXmark((prev) => !prev)}
          className={`${xmark && style.active}`}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
