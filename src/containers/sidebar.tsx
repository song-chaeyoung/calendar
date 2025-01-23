"use client";

import React from "react";
import style from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";

const list = [
  {
    name: "calendar",
    title: "Calendar",
  },
  {
    name: "menu2",
    title: "메뉴2",
  },
  {
    name: "menu3",
    title: "메뉴3",
  },
  {
    name: "menu4",
    title: "메뉴4",
  },
  {
    name: "menu5",
    title: "메뉴5",
  },
  {
    name: "menu6",
    title: "메뉴6",
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav className={style.container}>
      <ul>
        {list.map((item, idx) => (
          <li
            key={idx}
            className={`${pathname === `/${item.name}` && style.active}`}
          >
            <Link href={`/${item.name}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
